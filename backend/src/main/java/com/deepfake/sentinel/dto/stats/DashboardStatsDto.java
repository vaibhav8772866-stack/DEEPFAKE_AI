package com.deepfake.sentinel.dto.stats;

import java.util.List;
import java.util.Map;

public class DashboardStatsDto {
    private long totalScans;
    private long totalDeepfakes;
    private long totalReals;
    private long totalSuspicious;
    private double deepfakePercentage;
    private double averageConfidence;
    private long totalUsers;
    private Map<String, Long> scansByMediaType;
    private List<DailyScanMetricDto> timeline;

    public DashboardStatsDto() {}

    public DashboardStatsDto(long totalScans, long totalDeepfakes, long totalReals, long totalSuspicious, double deepfakePercentage, double averageConfidence, long totalUsers, Map<String, Long> scansByMediaType, List<DailyScanMetricDto> timeline) {
        this.totalScans = totalScans;
        this.totalDeepfakes = totalDeepfakes;
        this.totalReals = totalReals;
        this.totalSuspicious = totalSuspicious;
        this.deepfakePercentage = deepfakePercentage;
        this.averageConfidence = averageConfidence;
        this.totalUsers = totalUsers;
        this.scansByMediaType = scansByMediaType;
        this.timeline = timeline;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private long totalScans;
        private long totalDeepfakes;
        private long totalReals;
        private long totalSuspicious;
        private double deepfakePercentage;
        private double averageConfidence;
        private long totalUsers;
        private Map<String, Long> scansByMediaType;
        private List<DailyScanMetricDto> timeline;

        public Builder totalScans(long totalScans) { this.totalScans = totalScans; return this; }
        public Builder totalDeepfakes(long totalDeepfakes) { this.totalDeepfakes = totalDeepfakes; return this; }
        public Builder totalReals(long totalReals) { this.totalReals = totalReals; return this; }
        public Builder totalSuspicious(long totalSuspicious) { this.totalSuspicious = totalSuspicious; return this; }
        public Builder deepfakePercentage(double deepfakePercentage) { this.deepfakePercentage = deepfakePercentage; return this; }
        public Builder averageConfidence(double averageConfidence) { this.averageConfidence = averageConfidence; return this; }
        public Builder totalUsers(long totalUsers) { this.totalUsers = totalUsers; return this; }
        public Builder scansByMediaType(Map<String, Long> scansByMediaType) { this.scansByMediaType = scansByMediaType; return this; }
        public Builder timeline(List<DailyScanMetricDto> timeline) { this.timeline = timeline; return this; }

        public DashboardStatsDto build() {
            return new DashboardStatsDto(totalScans, totalDeepfakes, totalReals, totalSuspicious, deepfakePercentage, averageConfidence, totalUsers, scansByMediaType, timeline);
        }
    }

    public static class DailyScanMetricDto {
        private String date;
        private long total;
        private long deepfakes;
        private long reals;
        private long suspicious;

        public DailyScanMetricDto() {}

        public DailyScanMetricDto(String date, long total, long deepfakes, long reals, long suspicious) {
            this.date = date;
            this.total = total;
            this.deepfakes = deepfakes;
            this.reals = reals;
            this.suspicious = suspicious;
        }

        public static DailyScanMetricBuilder builder() { return new DailyScanMetricBuilder(); }

        public static class DailyScanMetricBuilder {
            private String date;
            private long total;
            private long deepfakes;
            private long reals;
            private long suspicious;

            public DailyScanMetricBuilder date(String date) { this.date = date; return this; }
            public DailyScanMetricBuilder total(long total) { this.total = total; return this; }
            public DailyScanMetricBuilder deepfakes(long deepfakes) { this.deepfakes = deepfakes; return this; }
            public DailyScanMetricBuilder reals(long reals) { this.reals = reals; return this; }
            public DailyScanMetricBuilder suspicious(long suspicious) { this.suspicious = suspicious; return this; }

            public DailyScanMetricDto build() {
                return new DailyScanMetricDto(date, total, deepfakes, reals, suspicious);
            }
        }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public long getTotal() { return total; }
        public void setTotal(long total) { this.total = total; }
        public long getDeepfakes() { return deepfakes; }
        public void setDeepfakes(long deepfakes) { this.deepfakes = deepfakes; }
        public long getReals() { return reals; }
        public void setReals(long reals) { this.reals = reals; }
        public long getSuspicious() { return suspicious; }
        public void setSuspicious(long suspicious) { this.suspicious = suspicious; }
    }

    public long getTotalScans() { return totalScans; }
    public void setTotalScans(long totalScans) { this.totalScans = totalScans; }
    public long getTotalDeepfakes() { return totalDeepfakes; }
    public void setTotalDeepfakes(long totalDeepfakes) { this.totalDeepfakes = totalDeepfakes; }
    public long getTotalReals() { return totalReals; }
    public void setTotalReals(long totalReals) { this.totalReals = totalReals; }
    public long getTotalSuspicious() { return totalSuspicious; }
    public void setTotalSuspicious(long totalSuspicious) { this.totalSuspicious = totalSuspicious; }
    public double getDeepfakePercentage() { return deepfakePercentage; }
    public void setDeepfakePercentage(double deepfakePercentage) { this.deepfakePercentage = deepfakePercentage; }
    public double getAverageConfidence() { return averageConfidence; }
    public void setAverageConfidence(double averageConfidence) { this.averageConfidence = averageConfidence; }
    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
    public Map<String, Long> getScansByMediaType() { return scansByMediaType; }
    public void setScansByMediaType(Map<String, Long> scansByMediaType) { this.scansByMediaType = scansByMediaType; }
    public List<DailyScanMetricDto> getTimeline() { return timeline; }
    public void setTimeline(List<DailyScanMetricDto> timeline) { this.timeline = timeline; }
}
