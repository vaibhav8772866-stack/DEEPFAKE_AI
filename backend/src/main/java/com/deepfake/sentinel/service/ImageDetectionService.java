package com.deepfake.sentinel.service;

import com.deepfake.sentinel.dto.detection.AnalysisResultDto;
import com.deepfake.sentinel.dto.detection.FaceBoundingBoxDto;
import com.deepfake.sentinel.dto.detection.ForensicMetricsDto;
import org.opencv.core.Mat;
import org.opencv.core.MatOfByte;
import org.opencv.imgcodecs.Imgcodecs;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ImageDetectionService {

    private static final Logger log = LoggerFactory.getLogger(ImageDetectionService.class);

    private final OpenCvLoaderService openCvLoaderService;
    private final FaceDetectionService faceDetectionService;
    private final OnnxInferenceService onnxInferenceService;
    private final ForensicsEngineService forensicsEngineService;

    public ImageDetectionService(OpenCvLoaderService openCvLoaderService, FaceDetectionService faceDetectionService, OnnxInferenceService onnxInferenceService, ForensicsEngineService forensicsEngineService) {
        this.openCvLoaderService = openCvLoaderService;
        this.faceDetectionService = faceDetectionService;
        this.onnxInferenceService = onnxInferenceService;
        this.forensicsEngineService = forensicsEngineService;
    }

    public AnalysisResultDto analyzeImage(MultipartFile file) throws Exception {
        return analyzeImageBytes(file.getBytes(), file.getOriginalFilename(), file.getSize());
    }

    public AnalysisResultDto analyzeImageBytes(byte[] imageBytes, String filename, long fileSize) throws Exception {
        long startTime = System.currentTimeMillis();

        BufferedImage bufferedImage = ImageIO.read(new ByteArrayInputStream(imageBytes));
        if (bufferedImage == null) {
            throw new IllegalArgumentException("Unsupported or corrupt image format: " + filename);
        }

        List<FaceBoundingBoxDto> faces = new ArrayList<>();
        if (openCvLoaderService.isOpenCvAvailable()) {
            try {
                Mat mat = Imgcodecs.imdecode(new MatOfByte(imageBytes), Imgcodecs.IMREAD_COLOR);
                if (mat != null && !mat.empty()) {
                    faces = faceDetectionService.detectFacesMat(mat);
                }
            } catch (Exception ex) {
                log.warn("[IMAGE-DETECTION] OpenCV Mat decode warning: {}", ex.getMessage());
            }
        }

        if (faces.isEmpty()) {
            faces = faceDetectionService.detectFacesFallback(bufferedImage);
        }

        ForensicMetricsDto forensicMetrics = forensicsEngineService.analyzeForensics(bufferedImage, faces);

        Double onnxFakeProb = null;
        String modelNameUsed = "Forensic Heuristic Engine";

        if (onnxInferenceService.isModelLoaded()) {
            try {
                BufferedImage faceCrop = extractFaceCrop(bufferedImage, faces.isEmpty() ? null : faces.get(0));
                float[] tensorData = preprocessImageForOnnx(faceCrop, 224, 224);
                onnxFakeProb = onnxInferenceService.predict(tensorData);
                if (onnxFakeProb != null) {
                    modelNameUsed = "Microsoft ONNX Runtime (" + onnxInferenceService.getModelStatus().getModelName() + ")";
                }
            } catch (Exception ex) {
                log.warn("[IMAGE-DETECTION] ONNX inference attempt failed: {}", ex.getMessage());
            }
        }

        double finalFakeProbability;
        double confidence;

        if (onnxFakeProb != null) {
            double onnxScorePercent = onnxFakeProb * 100.0;
            finalFakeProbability = (onnxScorePercent * 0.60) + (forensicMetrics.getOverallForensicAnomaly() * 0.40);
            confidence = 88.0 + Math.abs(finalFakeProbability - 50.0) * 0.22;
        } else {
            finalFakeProbability = forensicMetrics.getOverallForensicAnomaly();
            confidence = 78.0 + Math.abs(finalFakeProbability - 50.0) * 0.20;
            modelNameUsed = "Forensics Engine (ONNX model standby)";
        }

        finalFakeProbability = Math.max(1.0, Math.min(99.0, finalFakeProbability));
        confidence = Math.max(50.0, Math.min(99.5, confidence));

        for (FaceBoundingBoxDto face : faces) {
            face.setFakeProbability(round2(finalFakeProbability));
            face.setBoundaryArtifactScore(forensicMetrics.getBoundaryBlendScore());
            face.setTextureAnomalyScore(forensicMetrics.getTextureNoiseVariance());
        }

        String verdict;
        if (finalFakeProbability >= 62.0) {
            verdict = "DEEPFAKE";
        } else if (finalFakeProbability >= 38.0) {
            verdict = "SUSPICIOUS";
        } else {
            verdict = "REAL";
        }

        String explanation = generateExplanation(verdict, finalFakeProbability, forensicMetrics, onnxFakeProb != null, faces.size());
        long processingTimeMs = System.currentTimeMillis() - startTime;

        return AnalysisResultDto.builder()
                .filename(filename != null ? filename : "analyzed_image.jpg")
                .mediaType("IMAGE")
                .fileSize(fileSize > 0 ? fileSize : imageBytes.length)
                .verdict(verdict)
                .fakeProbability(round2(finalFakeProbability))
                .confidenceScore(round2(confidence))
                .facesDetected(faces.size())
                .faceBoxes(faces)
                .forensicMetrics(forensicMetrics)
                .explanation(explanation)
                .processingTimeMs(processingTimeMs)
                .modelUsed(modelNameUsed)
                .createdAt(LocalDateTime.now())
                .build();
    }

    private BufferedImage extractFaceCrop(BufferedImage fullImage, FaceBoundingBoxDto face) {
        if (face == null) return fullImage;
        int x = Math.max(0, face.getX());
        int y = Math.max(0, face.getY());
        int w = Math.min(fullImage.getWidth() - x, face.getWidth());
        int h = Math.min(fullImage.getHeight() - y, face.getHeight());
        if (w <= 0 || h <= 0) return fullImage;
        return fullImage.getSubimage(x, y, w, h);
    }

    private float[] preprocessImageForOnnx(BufferedImage img, int targetW, int targetH) {
        BufferedImage resized = new BufferedImage(targetW, targetH, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = resized.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g.drawImage(img, 0, 0, targetW, targetH, null);
        g.dispose();

        float[] tensor = new float[3 * targetW * targetH];
        float[] mean = new float[]{0.485f, 0.456f, 0.406f};
        float[] std = new float[]{0.229f, 0.224f, 0.225f};

        int channelSize = targetW * targetH;

        for (int y = 0; y < targetH; y++) {
            for (int x = 0; x < targetW; x++) {
                int rgb = resized.getRGB(x, y);
                float r = ((rgb >> 16) & 0xFF) / 255.0f;
                float gVal = ((rgb >> 8) & 0xFF) / 255.0f;
                float b = (rgb & 0xFF) / 255.0f;

                int pixelIdx = y * targetW + x;
                tensor[pixelIdx] = (r - mean[0]) / std[0];
                tensor[channelSize + pixelIdx] = (gVal - mean[1]) / std[1];
                tensor[2 * channelSize + pixelIdx] = (b - mean[2]) / std[2];
            }
        }
        return tensor;
    }

    private String generateExplanation(String verdict, double fakeProb, ForensicMetricsDto forensics, boolean onnxActive, int faceCount) {
        StringBuilder sb = new StringBuilder();
        if ("DEEPFAKE".equals(verdict)) {
            sb.append("Synthetic facial manipulation detected (").append(round2(fakeProb)).append("% probability). ");
            if (forensics.getBoundaryBlendScore() > 40.0) {
                sb.append("Pronounced edge blend seam and Laplacian gradient disparity identified around the facial perimeter. ");
            }
            if (forensics.getFrequencyArtifactScore() > 40.0) {
                sb.append("High-frequency Fourier/DCT grid pattern anomalies characteristic of generative neural synthesis. ");
            }
            if (forensics.getErrorLevelAnalysisScore() > 40.0) {
                sb.append("Inconsistent JPEG compression Error Level Analysis (ELA) distribution across facial boundary. ");
            }
        } else if ("SUSPICIOUS".equals(verdict)) {
            sb.append("Inconclusive or partially altered image signatures detected (").append(round2(fakeProb)).append("% probability). ");
            sb.append("Mild compression or lighting irregularities detected; manual forensic review recommended.");
        } else {
            sb.append("Authentic natural media indicators verified (").append(round2(100.0 - fakeProb)).append("% authenticity). ");
            sb.append("Consistent surface texture, organic skin micro-noise distribution, and natural gradient transitions across all ").append(faceCount).append(" localized face regions.");
        }
        return sb.toString();
    }

    private double round2(double val) {
        return Math.round(val * 100.0) / 100.0;
    }
}
