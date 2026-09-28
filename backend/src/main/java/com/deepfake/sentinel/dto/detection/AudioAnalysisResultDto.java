package com.deepfake.sentinel.dto.detection;

import java.time.LocalDateTime;

public class AudioAnalysisResultDto {
    private Long id;
    private String filename;
    private long fileSize;
    private double durationSec;
    private double fakeProbability;
    private double confidenceScore;
    private String verdict;
    private double spectralCentroidHz;
    private double zeroCrossingRate;
    private double frequencyCutoffKhz;
    private double roboticVocalArtifactScore;
    private double pitchJitterVariance;
    private String explanation;
    private long processingTimeMs;
    private LocalDateTime createdAt;

    public AudioAnalysisResultDto() {}

    public AudioAnalysisResultDto(Long id, String filename, long fileSize, double durationSec, double fakeProbability, double confidenceScore, String verdict, double spectralCentroidHz, double zeroCrossingRate, double frequencyCutoffKhz, double roboticVocalArtifactScore, double pitchJitterVariance, String explanation, long processingTimeMs, LocalDateTime createdAt) {
        this.id = id;
        this.filename = filename;
        this.fileSize = fileSize;
        this.durationSec = durationSec;
        this.fakeProbability = fakeProbability;
        this.confidenceScore = confidenceScore;
        this.verdict = verdict;
        this.spectralCentroidHz = spectralCentroidHz;
        this.zeroCrossingRate = zeroCrossingRate;
        this.frequencyCutoffKhz = frequencyCutoffKhz;
        this.roboticVocalArtifactScore = roboticVocalArtifactScore;
        this.pitchJitterVariance = pitchJitterVariance;
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
        private double fakeProbability;
        private double confidenceScore;
        private String verdict;
        private double spectralCentroidHz;
        private double zeroCrossingRate;
        private double frequencyCutoffKhz;
        private double roboticVocalArtifactScore;
        private double pitchJitterVariance;
        private String explanation;
        private long processingTimeMs;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder filename(String filename) { this.filename = filename; return this; }
        public Builder fileSize(long fileSize) { this.fileSize = fileSize; return this; }
        public Builder durationSec(double durationSec) { this.durationSec = durationSec; return this; }
        public Builder fakeProbability(double fakeProbability) { this.fakeProbability = fakeProbability; return this; }
        public Builder confidenceScore(double confidenceScore) { this.confidenceScore = confidenceScore; return this; }
        public Builder verdict(String verdict) { this.verdict = verdict; return this; }
        public Builder spectralCentroidHz(double spectralCentroidHz) { this.spectralCentroidHz = spectralCentroidHz; return this; }
        public Builder zeroCrossingRate(double zeroCrossingRate) { this.zeroCrossingRate = zeroCrossingRate; return this; }
        public Builder frequencyCutoffKhz(double frequencyCutoffKhz) { this.frequencyCutoffKhz = frequencyCutoffKhz; return this; }
        public Builder roboticVocalArtifactScore(double roboticVocalArtifactScore) { this.roboticVocalArtifactScore = roboticVocalArtifactScore; return this; }
        public Builder pitchJitterVariance(double pitchJitterVariance) { this.pitchJitterVariance = pitchJitterVariance; return this; }
        public Builder explanation(String explanation) { this.explanation = explanation; return this; }
        public Builder processingTimeMs(long processingTimeMs) { this.processingTimeMs = processingTimeMs; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public AudioAnalysisResultDto build() {
            return new AudioAnalysisResultDto(id, filename, fileSize, durationSec, fakeProbability, confidenceScore, verdict, spectralCentroidHz, zeroCrossingRate, frequencyCutoffKhz, roboticVocalArtifactScore, pitchJitterVariance, explanation, processingTimeMs, createdAt);
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
    public double getFakeProbability() { return fakeProbability; }
    public void setFakeProbability(double fakeProbability) { this.fakeProbability = fakeProbability; }
    public double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(double confidenceScore) { this.confidenceScore = confidenceScore; }
    public String getVerdict() { return verdict; }
    public void setVerdict(String verdict) { this.verdict = verdict; }
    public double getSpectralCentroidHz() { return spectralCentroidHz; }
    public void setSpectralCentroidHz(double spectralCentroidHz) { this.spectralCentroidHz = spectralCentroidHz; }
    public double getZeroCrossingRate() { return zeroCrossingRate; }
    public void setZeroCrossingRate(double zeroCrossingRate) { this.zeroCrossingRate = zeroCrossingRate; }
    public double getFrequencyCutoffKhz() { return frequencyCutoffKhz; }
    public void setFrequencyCutoffKhz(double frequencyCutoffKhz) { this.frequencyCutoffKhz = frequencyCutoffKhz; }
    public double getRoboticVocalArtifactScore() { return roboticVocalArtifactScore; }
    public void setRoboticVocalArtifactScore(double roboticVocalArtifactScore) { this.roboticVocalArtifactScore = roboticVocalArtifactScore; }
    public double getPitchJitterVariance() { return pitchJitterVariance; }
    public void setPitchJitterVariance(double pitchJitterVariance) { this.pitchJitterVariance = pitchJitterVariance; }
    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
    public long getProcessingTimeMs() { return processingTimeMs; }
    public void setProcessingTimeMs(long processingTimeMs) { this.processingTimeMs = processingTimeMs; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
