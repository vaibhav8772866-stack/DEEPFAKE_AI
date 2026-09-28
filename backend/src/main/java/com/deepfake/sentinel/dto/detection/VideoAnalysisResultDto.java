package com.deepfake.sentinel.dto.detection;

import java.time.LocalDateTime;
import java.util.List;

public class VideoAnalysisResultDto {
    private Long id;
    private String filename;
    private long fileSize;
    private double durationSec;
    private int totalFramesAnalyzed;
    private int deepfakeFramesCount;
    private double fakeProbability;
    private double confidenceScore;
    private String verdict;
    private double temporalInconsistencyScore;
    private List<VideoFrameDto> frames;
    private ForensicMetricsDto aggregateForensics;
    private String explanation;
    private long processingTimeMs;
    private LocalDateTime createdAt;

    public VideoAnalysisResultDto() {}

    public VideoAnalysisResultDto(Long id, String filename, long fileSize, double durationSec, int totalFramesAnalyzed, int deepfakeFramesCount, double fakeProbability, double confidenceScore, String verdict, double temporalInconsistencyScore, List<VideoFrameDto> frames, ForensicMetricsDto aggregateForensics, String explanation, long processingTimeMs, LocalDateTime createdAt) {
        this.id = id;
        this.filename = filename;
        this.fileSize = fileSize;
        this.durationSec = durationSec;
        this.totalFramesAnalyzed = totalFramesAnalyzed;
        this.deepfakeFramesCount = deepfakeFramesCount;
        this.fakeProbability = fakeProbability;
        this.confidenceScore = confidenceScore;
        this.verdict = verdict;
        this.temporalInconsistencyScore = temporalInconsistencyScore;
        this.frames = frames;
        this.aggregateForensics = aggregateForensics;
        this.explanation = explanation;
        this.processingTimeMs = processingTimeMs;
        this.createdAt = createdAt;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String filename;
        private long fileSize;
        private double durationSec;
        private int totalFramesAnalyzed;
        private int deepfakeFramesCount;
        private double fakeProbability;
        private double confidenceScore;
        private String verdict;
        private double temporalInconsistencyScore;
        private List<VideoFrameDto> frames;
        private ForensicMetricsDto aggregateForensics;
        private String explanation;
        private long processingTimeMs;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder filename(String filename) { this.filename = filename; return this; }
        public Builder fileSize(long fileSize) { this.fileSize = fileSize; return this; }
        public Builder durationSec(double durationSec) { this.durationSec = durationSec; return this; }
        public Builder totalFramesAnalyzed(int totalFramesAnalyzed) { this.totalFramesAnalyzed = totalFramesAnalyzed; return this; }
        public Builder deepfakeFramesCount(int deepfakeFramesCount) { this.deepfakeFramesCount = deepfakeFramesCount; return this; }
        public Builder fakeProbability(double fakeProbability) { this.fakeProbability = fakeProbability; return this; }
        public Builder confidenceScore(double confidenceScore) { this.confidenceScore = confidenceScore; return this; }
        public Builder verdict(String verdict) { this.verdict = verdict; return this; }
        public Builder temporalInconsistencyScore(double temporalInconsistencyScore) { this.temporalInconsistencyScore = temporalInconsistencyScore; return this; }
        public Builder frames(List<VideoFrameDto> frames) { this.frames = frames; return this; }
        public Builder aggregateForensics(ForensicMetricsDto aggregateForensics) { this.aggregateForensics = aggregateForensics; return this; }
        public Builder explanation(String explanation) { this.explanation = explanation; return this; }
        public Builder processingTimeMs(long processingTimeMs) { this.processingTimeMs = processingTimeMs; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public VideoAnalysisResultDto build() {
            return new VideoAnalysisResultDto(id, filename, fileSize, durationSec, totalFramesAnalyzed, deepfakeFramesCount, fakeProbability, confidenceScore, verdict, temporalInconsistencyScore, frames, aggregateForensics, explanation, processingTimeMs, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }
    public long getFileSize() { return fileSize; }
    public void setFileSize(long fileSize) { this.fileSize = fileSize; }
    public double getDurationSec() { return durationSec; }
    public void setDurationSec(double durationSec) { this.durationSec = durationSec; }
    public int getTotalFramesAnalyzed() { return totalFramesAnalyzed; }
    public void setTotalFramesAnalyzed(int totalFramesAnalyzed) { this.totalFramesAnalyzed = totalFramesAnalyzed; }
    public int getDeepfakeFramesCount() { return deepfakeFramesCount; }
    public void setDeepfakeFramesCount(int deepfakeFramesCount) { this.deepfakeFramesCount = deepfakeFramesCount; }
    public double getFakeProbability() { return fakeProbability; }
    public void setFakeProbability(double fakeProbability) { this.fakeProbability = fakeProbability; }
    public double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(double confidenceScore) { this.confidenceScore = confidenceScore; }
    public String getVerdict() { return verdict; }
    public void setVerdict(String verdict) { this.verdict = verdict; }
    public double getTemporalInconsistencyScore() { return temporalInconsistencyScore; }
    public void setTemporalInconsistencyScore(double temporalInconsistencyScore) { this.temporalInconsistencyScore = temporalInconsistencyScore; }
    public List<VideoFrameDto> getFrames() { return frames; }
    public void setFrames(List<VideoFrameDto> frames) { this.frames = frames; }
    public ForensicMetricsDto getAggregateForensics() { return aggregateForensics; }
    public void setAggregateForensics(ForensicMetricsDto aggregateForensics) { this.aggregateForensics = aggregateForensics; }
    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
    public long getProcessingTimeMs() { return processingTimeMs; }
    public void setProcessingTimeMs(long processingTimeMs) { this.processingTimeMs = processingTimeMs; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
