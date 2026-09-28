package com.deepfake.sentinel.dto.detection;

public class FaceBoundingBoxDto {
    private int x;
    private int y;
    private int width;
    private int height;
    private double detectionConfidence;
    private double fakeProbability;
    private String label;
    private double boundaryArtifactScore;
    private double textureAnomalyScore;

    public FaceBoundingBoxDto() {}

    public FaceBoundingBoxDto(int x, int y, int width, int height, double detectionConfidence, double fakeProbability, String label, double boundaryArtifactScore, double textureAnomalyScore) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.detectionConfidence = detectionConfidence;
        this.fakeProbability = fakeProbability;
        this.label = label;
        this.boundaryArtifactScore = boundaryArtifactScore;
        this.textureAnomalyScore = textureAnomalyScore;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private int x;
        private int y;
        private int width;
        private int height;
        private double detectionConfidence;
        private double fakeProbability;
        private String label;
        private double boundaryArtifactScore;
        private double textureAnomalyScore;

        public Builder x(int x) { this.x = x; return this; }
        public Builder y(int y) { this.y = y; return this; }
        public Builder width(int width) { this.width = width; return this; }
        public Builder height(int height) { this.height = height; return this; }
        public Builder detectionConfidence(double detectionConfidence) { this.detectionConfidence = detectionConfidence; return this; }
        public Builder fakeProbability(double fakeProbability) { this.fakeProbability = fakeProbability; return this; }
        public Builder label(String label) { this.label = label; return this; }
        public Builder boundaryArtifactScore(double boundaryArtifactScore) { this.boundaryArtifactScore = boundaryArtifactScore; return this; }
        public Builder textureAnomalyScore(double textureAnomalyScore) { this.textureAnomalyScore = textureAnomalyScore; return this; }

        public FaceBoundingBoxDto build() {
            return new FaceBoundingBoxDto(x, y, width, height, detectionConfidence, fakeProbability, label, boundaryArtifactScore, textureAnomalyScore);
        }
    }

    public int getX() { return x; }
    public void setX(int x) { this.x = x; }
    public int getY() { return y; }
    public void setY(int y) { this.y = y; }
    public int getWidth() { return width; }
    public void setWidth(int width) { this.width = width; }
    public int getHeight() { return height; }
    public void setHeight(int height) { this.height = height; }
    public double getDetectionConfidence() { return detectionConfidence; }
    public void setDetectionConfidence(double detectionConfidence) { this.detectionConfidence = detectionConfidence; }
    public double getFakeProbability() { return fakeProbability; }
    public void setFakeProbability(double fakeProbability) { this.fakeProbability = fakeProbability; }
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public double getBoundaryArtifactScore() { return boundaryArtifactScore; }
    public void setBoundaryArtifactScore(double boundaryArtifactScore) { this.boundaryArtifactScore = boundaryArtifactScore; }
    public double getTextureAnomalyScore() { return textureAnomalyScore; }
    public void setTextureAnomalyScore(double textureAnomalyScore) { this.textureAnomalyScore = textureAnomalyScore; }
}
