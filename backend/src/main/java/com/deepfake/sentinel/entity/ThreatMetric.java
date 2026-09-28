package com.deepfake.sentinel.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "threat_metrics")
public class ThreatMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "metric_date", unique = true, nullable = false)
    private LocalDate metricDate;

    @Column(name = "total_scans", nullable = false)
    private Long totalScans;

    @Column(name = "deepfakes_count", nullable = false)
    private Long deepfakesCount;

    @Column(name = "reals_count", nullable = false)
    private Long realsCount;

    @Column(name = "suspicious_count", nullable = false)
    private Long suspiciousCount;

    @Column(name = "avg_confidence")
    private Double avgConfidence;

    public ThreatMetric() {}

    public ThreatMetric(Long id, LocalDate metricDate, Long totalScans, Long deepfakesCount, Long realsCount, Long suspiciousCount, Double avgConfidence) {
        this.id = id;
        this.metricDate = metricDate;
        this.totalScans = totalScans;
        this.deepfakesCount = deepfakesCount;
        this.realsCount = realsCount;
        this.suspiciousCount = suspiciousCount;
        this.avgConfidence = avgConfidence;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private LocalDate metricDate;
        private Long totalScans = 0L;
        private Long deepfakesCount = 0L;
        private Long realsCount = 0L;
        private Long suspiciousCount = 0L;
        private Double avgConfidence = 0.0;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder metricDate(LocalDate metricDate) { this.metricDate = metricDate; return this; }
        public Builder totalScans(Long totalScans) { this.totalScans = totalScans; return this; }
        public Builder deepfakesCount(Long deepfakesCount) { this.deepfakesCount = deepfakesCount; return this; }
        public Builder realsCount(Long realsCount) { this.realsCount = realsCount; return this; }
        public Builder suspiciousCount(Long suspiciousCount) { this.suspiciousCount = suspiciousCount; return this; }
        public Builder avgConfidence(Double avgConfidence) { this.avgConfidence = avgConfidence; return this; }

        public ThreatMetric build() {
            return new ThreatMetric(id, metricDate, totalScans, deepfakesCount, realsCount, suspiciousCount, avgConfidence);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getMetricDate() { return metricDate; }
    public void setMetricDate(LocalDate metricDate) { this.metricDate = metricDate; }
    public Long getTotalScans() { return totalScans; }
    public void setTotalScans(Long totalScans) { this.totalScans = totalScans; }
    public Long getDeepfakesCount() { return deepfakesCount; }
    public void setDeepfakesCount(Long deepfakesCount) { this.deepfakesCount = deepfakesCount; }
    public Long getRealsCount() { return realsCount; }
    public void setRealsCount(Long realsCount) { this.realsCount = realsCount; }
    public Long getSuspiciousCount() { return suspiciousCount; }
    public void setSuspiciousCount(Long suspiciousCount) { this.suspiciousCount = suspiciousCount; }
    public Double getAvgConfidence() { return avgConfidence; }
    public void setAvgConfidence(Double avgConfidence) { this.avgConfidence = avgConfidence; }
}
