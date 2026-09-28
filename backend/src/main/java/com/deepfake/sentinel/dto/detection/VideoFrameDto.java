package com.deepfake.sentinel.dto.detection;

public class VideoFrameDto {
    private int frameIndex;
    private double timestampSec;
    private double fakeProbability;
    private String verdict;
    private boolean faceDetected;
    private double temporalJitter;

    public VideoFrameDto() {}

    public VideoFrameDto(int frameIndex, double timestampSec, double fakeProbability, String verdict, boolean faceDetected, double temporalJitter) {
        this.frameIndex = frameIndex;
        this.timestampSec = timestampSec;
        this.fakeProbability = fakeProbability;
        this.verdict = verdict;
        this.faceDetected = faceDetected;
        this.temporalJitter = temporalJitter;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private int frameIndex;
        private double timestampSec;
        private double fakeProbability;
        private String verdict;
        private boolean faceDetected;
        private double temporalJitter;

        public Builder frameIndex(int frameIndex) { this.frameIndex = frameIndex; return this; }
        public Builder timestampSec(double timestampSec) { this.timestampSec = timestampSec; return this; }
        public Builder fakeProbability(double fakeProbability) { this.fakeProbability = fakeProbability; return this; }
        public Builder verdict(String verdict) { this.verdict = verdict; return this; }
        public Builder faceDetected(boolean faceDetected) { this.faceDetected = faceDetected; return this; }
        public Builder temporalJitter(double temporalJitter) { this.temporalJitter = temporalJitter; return this; }

        public VideoFrameDto build() {
            return new VideoFrameDto(frameIndex, timestampSec, fakeProbability, verdict, faceDetected, temporalJitter);
        }
    }

    public int getFrameIndex() { return frameIndex; }
    public void setFrameIndex(int frameIndex) { this.frameIndex = frameIndex; }
    public double getTimestampSec() { return timestampSec; }
    public void setTimestampSec(double timestampSec) { this.timestampSec = timestampSec; }
    public double getFakeProbability() { return fakeProbability; }
    public void setFakeProbability(double fakeProbability) { this.fakeProbability = fakeProbability; }
    public String getVerdict() { return verdict; }
    public void setVerdict(String verdict) { this.verdict = verdict; }
    public boolean isFaceDetected() { return faceDetected; }
    public void setFaceDetected(boolean faceDetected) { this.faceDetected = faceDetected; }
    public double getTemporalJitter() { return temporalJitter; }
    public void setTemporalJitter(double temporalJitter) { this.temporalJitter = temporalJitter; }
}
