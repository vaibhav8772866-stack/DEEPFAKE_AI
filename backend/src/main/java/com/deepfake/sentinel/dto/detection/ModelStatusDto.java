package com.deepfake.sentinel.dto.detection;

public class ModelStatusDto {
    private boolean onnxModelLoaded;
    private String onnxModelPath;
    private boolean cascadeLoaded;
    private String cascadePath;
    private String inferenceEngine;
    private String openCvStatus;
    private String activeExecutionProvider;
    private String modelName;
    private int inputWidth;
    private int inputHeight;
    private String statusMessage;

    public ModelStatusDto() {}

    public ModelStatusDto(boolean onnxModelLoaded, String onnxModelPath, boolean cascadeLoaded, String cascadePath, String inferenceEngine, String openCvStatus, String activeExecutionProvider, String modelName, int inputWidth, int inputHeight, String statusMessage) {
        this.onnxModelLoaded = onnxModelLoaded;
        this.onnxModelPath = onnxModelPath;
        this.cascadeLoaded = cascadeLoaded;
        this.cascadePath = cascadePath;
        this.inferenceEngine = inferenceEngine;
        this.openCvStatus = openCvStatus;
        this.activeExecutionProvider = activeExecutionProvider;
        this.modelName = modelName;
        this.inputWidth = inputWidth;
        this.inputHeight = inputHeight;
        this.statusMessage = statusMessage;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private boolean onnxModelLoaded;
        private String onnxModelPath;
        private boolean cascadeLoaded;
        private String cascadePath;
        private String inferenceEngine;
        private String openCvStatus;
        private String activeExecutionProvider;
        private String modelName;
        private int inputWidth;
        private int inputHeight;
        private String statusMessage;

        public Builder onnxModelLoaded(boolean onnxModelLoaded) { this.onnxModelLoaded = onnxModelLoaded; return this; }
        public Builder onnxModelPath(String onnxModelPath) { this.onnxModelPath = onnxModelPath; return this; }
        public Builder cascadeLoaded(boolean cascadeLoaded) { this.cascadeLoaded = cascadeLoaded; return this; }
        public Builder cascadePath(String cascadePath) { this.cascadePath = cascadePath; return this; }
        public Builder inferenceEngine(String inferenceEngine) { this.inferenceEngine = inferenceEngine; return this; }
        public Builder openCvStatus(String openCvStatus) { this.openCvStatus = openCvStatus; return this; }
        public Builder activeExecutionProvider(String activeExecutionProvider) { this.activeExecutionProvider = activeExecutionProvider; return this; }
        public Builder modelName(String modelName) { this.modelName = modelName; return this; }
        public Builder inputWidth(int inputWidth) { this.inputWidth = inputWidth; return this; }
        public Builder inputHeight(int inputHeight) { this.inputHeight = inputHeight; return this; }
        public Builder statusMessage(String statusMessage) { this.statusMessage = statusMessage; return this; }

        public ModelStatusDto build() {
            return new ModelStatusDto(onnxModelLoaded, onnxModelPath, cascadeLoaded, cascadePath, inferenceEngine, openCvStatus, activeExecutionProvider, modelName, inputWidth, inputHeight, statusMessage);
        }
    }

    public boolean isOnnxModelLoaded() { return onnxModelLoaded; }
    public void setOnnxModelLoaded(boolean onnxModelLoaded) { this.onnxModelLoaded = onnxModelLoaded; }
    public String getOnnxModelPath() { return onnxModelPath; }
    public void setOnnxModelPath(String onnxModelPath) { this.onnxModelPath = onnxModelPath; }
    public boolean isCascadeLoaded() { return cascadeLoaded; }
    public void setCascadeLoaded(boolean cascadeLoaded) { this.cascadeLoaded = cascadeLoaded; }
    public String getCascadePath() { return cascadePath; }
    public void setCascadePath(String cascadePath) { this.cascadePath = cascadePath; }
    public String getInferenceEngine() { return inferenceEngine; }
    public void setInferenceEngine(String inferenceEngine) { this.inferenceEngine = inferenceEngine; }
    public String getOpenCvStatus() { return openCvStatus; }
    public void setOpenCvStatus(String openCvStatus) { this.openCvStatus = openCvStatus; }
    public String getActiveExecutionProvider() { return activeExecutionProvider; }
    public void setActiveExecutionProvider(String activeExecutionProvider) { this.activeExecutionProvider = activeExecutionProvider; }
    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }
    public int getInputWidth() { return inputWidth; }
    public void setInputWidth(int inputWidth) { this.inputWidth = inputWidth; }
    public int getInputHeight() { return inputHeight; }
    public void setInputHeight(int inputHeight) { this.inputHeight = inputHeight; }
    public String getStatusMessage() { return statusMessage; }
    public void setStatusMessage(String statusMessage) { this.statusMessage = statusMessage; }
}
