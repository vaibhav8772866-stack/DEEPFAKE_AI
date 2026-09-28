package com.deepfake.sentinel.dto.detection;

public class ForensicMetricsDto {
    private double boundaryBlendScore;
    private double frequencyArtifactScore;
    private double errorLevelAnalysisScore;
    private double colorInconsistencyScore;
    private double textureNoiseVariance;
    private double eyeSymmetryScore;
    private double overallForensicAnomaly;

    public ForensicMetricsDto() {}

    public ForensicMetricsDto(double boundaryBlendScore, double frequencyArtifactScore, double errorLevelAnalysisScore, double colorInconsistencyScore, double textureNoiseVariance, double eyeSymmetryScore, double overallForensicAnomaly) {
        this.boundaryBlendScore = boundaryBlendScore;
        this.frequencyArtifactScore = frequencyArtifactScore;
        this.errorLevelAnalysisScore = errorLevelAnalysisScore;
        this.colorInconsistencyScore = colorInconsistencyScore;
        this.textureNoiseVariance = textureNoiseVariance;
        this.eyeSymmetryScore = eyeSymmetryScore;
        this.overallForensicAnomaly = overallForensicAnomaly;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private double boundaryBlendScore;
        private double frequencyArtifactScore;
        private double errorLevelAnalysisScore;
        private double colorInconsistencyScore;
        private double textureNoiseVariance;
        private double eyeSymmetryScore;
        private double overallForensicAnomaly;

        public Builder boundaryBlendScore(double boundaryBlendScore) { this.boundaryBlendScore = boundaryBlendScore; return this; }
        public Builder frequencyArtifactScore(double frequencyArtifactScore) { this.frequencyArtifactScore = frequencyArtifactScore; return this; }
        public Builder errorLevelAnalysisScore(double errorLevelAnalysisScore) { this.errorLevelAnalysisScore = errorLevelAnalysisScore; return this; }
        public Builder colorInconsistencyScore(double colorInconsistencyScore) { this.colorInconsistencyScore = colorInconsistencyScore; return this; }
        public Builder textureNoiseVariance(double textureNoiseVariance) { this.textureNoiseVariance = textureNoiseVariance; return this; }
        public Builder eyeSymmetryScore(double eyeSymmetryScore) { this.eyeSymmetryScore = eyeSymmetryScore; return this; }
        public Builder overallForensicAnomaly(double overallForensicAnomaly) { this.overallForensicAnomaly = overallForensicAnomaly; return this; }

        public ForensicMetricsDto build() {
            return new ForensicMetricsDto(boundaryBlendScore, frequencyArtifactScore, errorLevelAnalysisScore, colorInconsistencyScore, textureNoiseVariance, eyeSymmetryScore, overallForensicAnomaly);
        }
    }

    public double getBoundaryBlendScore() { return boundaryBlendScore; }
    public void setBoundaryBlendScore(double boundaryBlendScore) { this.boundaryBlendScore = boundaryBlendScore; }
    public double getFrequencyArtifactScore() { return frequencyArtifactScore; }
    public void setFrequencyArtifactScore(double frequencyArtifactScore) { this.frequencyArtifactScore = frequencyArtifactScore; }
    public double getErrorLevelAnalysisScore() { return errorLevelAnalysisScore; }
    public void setErrorLevelAnalysisScore(double errorLevelAnalysisScore) { this.errorLevelAnalysisScore = errorLevelAnalysisScore; }
    public double getColorInconsistencyScore() { return colorInconsistencyScore; }
    public void setColorInconsistencyScore(double colorInconsistencyScore) { this.colorInconsistencyScore = colorInconsistencyScore; }
    public double getTextureNoiseVariance() { return textureNoiseVariance; }
    public void setTextureNoiseVariance(double textureNoiseVariance) { this.textureNoiseVariance = textureNoiseVariance; }
    public double getEyeSymmetryScore() { return eyeSymmetryScore; }
    public void setEyeSymmetryScore(double eyeSymmetryScore) { this.eyeSymmetryScore = eyeSymmetryScore; }
    public double getOverallForensicAnomaly() { return overallForensicAnomaly; }
    public void setOverallForensicAnomaly(double overallForensicAnomaly) { this.overallForensicAnomaly = overallForensicAnomaly; }
}
