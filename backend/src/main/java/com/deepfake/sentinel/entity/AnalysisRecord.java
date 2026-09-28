package com.deepfake.sentinel.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "analysis_records")
public class AnalysisRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String filename;

    @Column(name = "media_type", nullable = false, length = 20)
    private String mediaType; // IMAGE, VIDEO, AUDIO

    @Column(name = "file_size")
    private Long fileSize;

    @Column(nullable = false, length = 30)
    private String verdict; // REAL, SUSPICIOUS, DEEPFAKE

    @Column(name = "fake_probability", nullable = false)
    private Double fakeProbability;

    @Column(name = "confidence_score", nullable = false)
    private Double confidenceScore;

    @Column(name = "faces_detected")
    private Integer facesDetected;

    @Column(name = "processing_time_ms")
    private Long processingTimeMs;

    @Column(name = "forensic_summary", columnDefinition = "TEXT")
    private String forensicSummary;

    @Column(name = "metrics_json", columnDefinition = "TEXT")
    private String metricsJson;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "username", length = 50)
    private String username;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public AnalysisRecord() {}

    public AnalysisRecord(Long id, String filename, String mediaType, Long fileSize, String verdict, Double fakeProbability, Double confidenceScore, Integer facesDetected, Long processingTimeMs, String forensicSummary, String metricsJson, Long userId, String username, LocalDateTime createdAt) {
        this.id = id;
        this.filename = filename;
        this.mediaType = mediaType;
        this.fileSize = fileSize;
        this.verdict = verdict;
        this.fakeProbability = fakeProbability;
        this.confidenceScore = confidenceScore;
        this.facesDetected = facesDetected;
        this.processingTimeMs = processingTimeMs;
        this.forensicSummary = forensicSummary;
        this.metricsJson = metricsJson;
        this.userId = userId;
        this.username = username;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String filename;
        private String mediaType;
        private Long fileSize;
        private String verdict;
        private Double fakeProbability;
        private Double confidenceScore;
        private Integer facesDetected;
        private Long processingTimeMs;
        private String forensicSummary;
        private String metricsJson;
        private Long userId;
        private String username;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder filename(String filename) { this.filename = filename; return this; }
        public Builder mediaType(String mediaType) { this.mediaType = mediaType; return this; }
        public Builder fileSize(Long fileSize) { this.fileSize = fileSize; return this; }
        public Builder verdict(String verdict) { this.verdict = verdict; return this; }
        public Builder fakeProbability(Double fakeProbability) { this.fakeProbability = fakeProbability; return this; }
        public Builder confidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; return this; }
        public Builder facesDetected(Integer facesDetected) { this.facesDetected = facesDetected; return this; }
        public Builder processingTimeMs(Long processingTimeMs) { this.processingTimeMs = processingTimeMs; return this; }
        public Builder forensicSummary(String forensicSummary) { this.forensicSummary = forensicSummary; return this; }
        public Builder metricsJson(String metricsJson) { this.metricsJson = metricsJson; return this; }
        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder username(String username) { this.username = username; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public AnalysisRecord build() {
            return new AnalysisRecord(id, filename, mediaType, fileSize, verdict, fakeProbability, confidenceScore, facesDetected, processingTimeMs, forensicSummary, metricsJson, userId, username, createdAt);
        }
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public String getVerdict() { return verdict; }
    public void setVerdict(String verdict) { this.verdict = verdict; }

    public Double getFakeProbability() { return fakeProbability; }
    public void setFakeProbability(Double fakeProbability) { this.fakeProbability = fakeProbability; }

    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }

    public Integer getFacesDetected() { return facesDetected; }
    public void setFacesDetected(Integer facesDetected) { this.facesDetected = facesDetected; }

    public Long getProcessingTimeMs() { return processingTimeMs; }
    public void setProcessingTimeMs(Long processingTimeMs) { this.processingTimeMs = processingTimeMs; }

    public String getForensicSummary() { return forensicSummary; }
    public void setForensicSummary(String forensicSummary) { this.forensicSummary = forensicSummary; }

    public String getMetricsJson() { return metricsJson; }
    public void setMetricsJson(String metricsJson) { this.metricsJson = metricsJson; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
