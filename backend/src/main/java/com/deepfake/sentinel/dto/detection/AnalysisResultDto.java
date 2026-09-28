package com.deepfake.sentinel.dto.detection;

import java.time.LocalDateTime;
import java.util.List;

public class AnalysisResultDto {
    private Long id;
    private String filename;
    private String mediaType;
    private long fileSize;
    private String verdict;
    private double fakeProbability;
    private double confidenceScore;
    private int facesDetected;
    private List<FaceBoundingBoxDto> faceBoxes;
    private ForensicMetricsDto forensicMetrics;
    private String explanation;
    private long processingTimeMs;
    private String modelUsed;
    private LocalDateTime createdAt;

    public AnalysisResultDto() {}

    public AnalysisResultDto(Long id, String filename, String mediaType, long fileSize, String verdict, double fakeProbability, double confidenceScore, int facesDetected, List<FaceBoundingBoxDto> faceBoxes, ForensicMetricsDto forensicMetrics, String explanation, long processingTimeMs, String modelUsed, LocalDateTime createdAt) {
        this.id = id;
        this.filename = filename;
        this.mediaType = mediaType;
        this.fileSize = fileSize;
        this.verdict = verdict;
        this.fakeProbability = fakeProbability;
        this.confidenceScore = confidenceScore;
        this.facesDetected = facesDetected;
        this.faceBoxes = faceBoxes;
        this.forensicMetrics = forensicMetrics;
        this.explanation = explanation;
        this.processingTimeMs = processingTimeMs;
        this.modelUsed = modelUsed;
        this.createdAt = createdAt;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String filename;
        private String mediaType;
        private long fileSize;
        private String verdict;
        private double fakeProbability;
        private double confidenceScore;
        private int facesDetected;
        private List<FaceBoundingBoxDto> faceBoxes;
        private ForensicMetricsDto forensicMetrics;
        private String explanation;
        private long processingTimeMs;
        private String modelUsed;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder filename(String filename) { this.filename = filename; return this; }
        public Builder mediaType(String mediaType) { this.mediaType = mediaType; return this; }
        public Builder fileSize(long fileSize) { this.fileSize = fileSize; return this; }
        public Builder verdict(String verdict) { this.verdict = verdict; return this; }
        public Builder fakeProbability(double fakeProbability) { this.fakeProbability = fakeProbability; return this; }
        public Builder confidenceScore(double confidenceScore) { this.confidenceScore = confidenceScore; return this; }
        public Builder facesDetected(int facesDetected) { this.facesDetected = facesDetected; return this; }
        public Builder faceBoxes(List<FaceBoundingBoxDto> faceBoxes) { this.faceBoxes = faceBoxes; return this; }
        public Builder forensicMetrics(ForensicMetricsDto forensicMetrics) { this.forensicMetrics = forensicMetrics; return this; }
        public Builder explanation(String explanation) { this.explanation = explanation; return this; }
        public Builder processingTimeMs(long processingTimeMs) { this.processingTimeMs = processingTimeMs; return this; }
        public Builder modelUsed(String modelUsed) { this.modelUsed = modelUsed; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public AnalysisResultDto build() {
            return new AnalysisResultDto(id, filename, mediaType, fileSize, verdict, fakeProbability, confidenceScore, facesDetected, faceBoxes, forensicMetrics, explanation, processingTimeMs, modelUsed, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }
    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }
    public long getFileSize() { return fileSize; }
    public void setFileSize(long fileSize) { this.fileSize = fileSize; }
    public String getVerdict() { return verdict; }
    public void setVerdict(String verdict) { this.verdict = verdict; }
    public double getFakeProbability() { return fakeProbability; }
    public void setFakeProbability(double fakeProbability) { this.fakeProbability = fakeProbability; }
    public double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(double confidenceScore) { this.confidenceScore = confidenceScore; }
    public int getFacesDetected() { return facesDetected; }
    public void setFacesDetected(int facesDetected) { this.facesDetected = facesDetected; }
    public List<FaceBoundingBoxDto> getFaceBoxes() { return faceBoxes; }
    public void setFaceBoxes(List<FaceBoundingBoxDto> faceBoxes) { this.faceBoxes = faceBoxes; }
    public ForensicMetricsDto getForensicMetrics() { return forensicMetrics; }
    public void setForensicMetrics(ForensicMetricsDto forensicMetrics) { this.forensicMetrics = forensicMetrics; }
    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
    public long getProcessingTimeMs() { return processingTimeMs; }
    public void setProcessingTimeMs(long processingTimeMs) { this.processingTimeMs = processingTimeMs; }
    public String getModelUsed() { return modelUsed; }
    public void setModelUsed(String modelUsed) { this.modelUsed = modelUsed; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
