package com.deepfake.sentinel.service;

import ai.onnxruntime.*;
import com.deepfake.sentinel.dto.detection.ModelStatusDto;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.FloatBuffer;
import java.util.Collections;
import java.util.Map;

@Service
public class OnnxInferenceService {

    private static final Logger log = LoggerFactory.getLogger(OnnxInferenceService.class);

    @Value("${app.ai.model-path:ai-model/models/model_q4.onnx}")
    private String configuredModelPath;

    @Value("${app.ai.input-width:224}")
    private int inputWidth;

    @Value("${app.ai.input-height:224}")
    private int inputHeight;

    private OrtEnvironment env;
    private OrtSession session;

    private boolean modelLoaded = false;
    private String resolvedModelPath = "";
    private String inputTensorName = "";
    private String outputTensorName = "";
    private long[] expectedInputShape = new long[]{1, 3, 224, 224};
    private String statusMessage = "Uninitialized";
    private String executionProvider = "CPU";
    private long modelFileSizeBytes = 0;

    @PostConstruct
    public synchronized void init() {
        try {
            this.env = OrtEnvironment.getEnvironment("DeepfakeSentinelOrtEnv");
            File modelFile = resolveModelFile();

            if (modelFile == null || !modelFile.exists() || modelFile.length() == 0) {
                this.modelLoaded = false;
                this.resolvedModelPath = (modelFile != null) ? modelFile.getAbsolutePath() : "ai-model/models/model_q4.onnx";
                this.statusMessage = "model_q4.onnx is missing from the project. Place the model file in 'ai-model/models/model_q4.onnx'.";
                log.warn("===============================================================================");
                log.warn("[ONNX-RUNTIME] model_q4.onnx is missing from the project.");
                log.warn("[ONNX-RUNTIME] Expected model location: {}", this.resolvedModelPath);
                log.warn("[ONNX-RUNTIME] Real AI inference requires model_q4.onnx.");
                log.warn("===============================================================================");
                return;
            }

            this.resolvedModelPath = modelFile.getAbsolutePath();
            this.modelFileSizeBytes = modelFile.length();

            log.info("[ONNX] Validating ONNX model file: {} ({} bytes)", resolvedModelPath, modelFileSizeBytes);

            OrtSession.SessionOptions sessionOptions = new OrtSession.SessionOptions();
            sessionOptions.setOptimizationLevel(OrtSession.SessionOptions.OptLevel.ALL_OPT);

            // Create in-process ONNX Runtime session
            this.session = env.createSession(resolvedModelPath, sessionOptions);

            // Validate and inspect Input Tensors
            Map<String, NodeInfo> inputInfoMap = session.getInputInfo();
            if (inputInfoMap.isEmpty()) {
                throw new IllegalStateException("ONNX Model has no input nodes defined.");
            }
            this.inputTensorName = inputInfoMap.keySet().iterator().next();
            NodeInfo inputInfo = inputInfoMap.get(inputTensorName);
            TensorInfo tensorInfo = (TensorInfo) inputInfo.getInfo();
            long[] shape = tensorInfo.getShape();
            if (shape != null && shape.length >= 4) {
                this.expectedInputShape = shape;
            }

            // Validate and inspect Output Tensors
            Map<String, NodeInfo> outputInfoMap = session.getOutputInfo();
            if (!outputInfoMap.isEmpty()) {
                this.outputTensorName = outputInfoMap.keySet().iterator().next();
            }

            this.modelLoaded = true;
            this.statusMessage = "ONNX Model loaded successfully: " + modelFile.getName() + " (" + (modelFileSizeBytes / 1024) + " KB)";

            log.info("===============================================================================");
            log.info("[ONNX] Model loaded successfully");
            log.info("[ONNX] Model path: {}", resolvedModelPath);
            log.info("[ONNX] Model file size: {} bytes ({} KB)", modelFileSizeBytes, modelFileSizeBytes / 1024);
            log.info("[ONNX] Input Node: {} -> Shape: [{}, {}, {}, {}]", inputTensorName,
                    expectedInputShape[0], expectedInputShape[1], expectedInputShape[2], expectedInputShape[3]);
            log.info("[ONNX] Output Node: {}", outputTensorName);
            log.info("[ONNX] Execution Provider: {}", executionProvider);
            log.info("===============================================================================");

        } catch (Throwable t) {
            this.modelLoaded = false;
            this.statusMessage = "ONNX Model initialization failed: " + t.getMessage();
            log.error("[ONNX] Failed to load ONNX model session: {}", t.getMessage(), t);
        }
    }

    public synchronized boolean reloadModel() {
        log.info("[ONNX] Attempting to reload ONNX model session...");
        if (session != null) {
            try {
                session.close();
            } catch (Exception ignored) {}
            session = null;
        }
        init();
        return modelLoaded;
    }

    /**
     * Executes real ONNX Runtime inference using float[] tensor [1, 3, 224, 224].
     * Returns the predicted deepfake probability [0.0 - 1.0].
     */
    public Double predict(float[] nchwTensorData) {
        if (!modelLoaded || session == null || env == null) {
            // Attempt one dynamic reload before reporting
            if (!reloadModel()) {
                log.error("[ONNX] Inference requested but model_q4.onnx is not loaded in ONNX Runtime.");
                return null;
            }
        }

        try {
            long[] shape = new long[]{1, 3, inputHeight, inputWidth};
            FloatBuffer floatBuffer = FloatBuffer.wrap(nchwTensorData);
            OnnxTensor inputTensor = OnnxTensor.createTensor(env, floatBuffer, shape);

            try (OrtSession.Result results = session.run(Collections.singletonMap(inputTensorName, inputTensor))) {
                Object rawValue = results.get(0).getValue();

                if (rawValue instanceof float[][]) {
                    float[][] logits = (float[][]) rawValue;
                    if (logits.length > 0) {
                        float[] row = logits[0];
                        if (row.length == 1) {
                            return (double) sigmoid(row[0]);
                        } else if (row.length >= 2) {
                            float[] probs = softmax(row);
                            return (double) probs[1]; // Index 1: Deepfake / Synthetic class
                        }
                    }
                } else if (rawValue instanceof float[]) {
                    float[] row = (float[]) rawValue;
                    if (row.length == 1) {
                        return (double) sigmoid(row[0]);
                    } else if (row.length >= 2) {
                        float[] probs = softmax(row);
                        return (double) probs[1];
                    }
                }
            } finally {
                inputTensor.close();
            }
        } catch (Exception ex) {
            log.error("[ONNX] Execution error during tensor inference: {}", ex.getMessage(), ex);
        }

        return null;
    }

    private float sigmoid(float val) {
        return (float) (1.0 / (1.0 + Math.exp(-val)));
    }

    private float[] softmax(float[] logits) {
        float max = Float.NEGATIVE_INFINITY;
        for (float v : logits) {
            if (v > max) max = v;
        }
        float sum = 0.0f;
        float[] exp = new float[logits.length];
        for (int i = 0; i < logits.length; i++) {
            exp[i] = (float) Math.exp(logits[i] - max);
            sum += exp[i];
        }
        for (int i = 0; i < logits.length; i++) {
            exp[i] /= (sum > 0 ? sum : 1.0f);
        }
        return exp;
    }

    private File resolveModelFile() {
        String[] candidatePaths = new String[]{
                configuredModelPath,
                "ai-model/models/model_q4.onnx",
                "../ai-model/models/model_q4.onnx",
                "C:\\Users\\vaibh\\Desktop\\ll\\ai-model\\models\\model_q4.onnx"
        };

        for (String p : candidatePaths) {
            File f = new File(p);
            if (f.exists() && f.isFile() && f.length() > 0) {
                return f;
            }
        }
        return new File("ai-model/models/model_q4.onnx");
    }

    public ModelStatusDto getModelStatus() {
        return ModelStatusDto.builder()
                .onnxModelLoaded(modelLoaded)
                .onnxModelPath(resolvedModelPath)
                .cascadeLoaded(true)
                .cascadePath("ai-model/models/haarcascade_frontalface_default.xml")
                .inferenceEngine("Microsoft ONNX Runtime Java (" + (modelLoaded ? "ACTIVE_REAL_INFERENCE" : "STANDBY") + ")")
                .openCvStatus("OpenCV 4.7.0 Java")
                .activeExecutionProvider(executionProvider)
                .modelName(modelLoaded ? new File(resolvedModelPath).getName() : "model_q4.onnx (Not Loaded)")
                .inputWidth(inputWidth)
                .inputHeight(inputHeight)
                .statusMessage(statusMessage)
                .build();
    }

    public boolean isModelLoaded() { return modelLoaded; }
    public String getResolvedModelPath() { return resolvedModelPath; }
    public String getInputTensorName() { return inputTensorName; }
    public String getOutputTensorName() { return outputTensorName; }
    public long getModelFileSizeBytes() { return modelFileSizeBytes; }
    public String getStatusMessage() { return statusMessage; }
    public String getExecutionProvider() { return executionProvider; }

    @PreDestroy
    public void cleanup() {
        if (session != null) {
            try {
                session.close();
            } catch (Exception ignored) {}
        }
        if (env != null) {
            try {
                env.close();
            } catch (Exception ignored) {}
        }
    }
}

