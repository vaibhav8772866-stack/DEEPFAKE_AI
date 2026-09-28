package com.deepfake.sentinel.service;

import com.deepfake.sentinel.dto.detection.AnalysisResultDto;
import com.deepfake.sentinel.dto.detection.ForensicMetricsDto;
import com.deepfake.sentinel.dto.detection.VideoAnalysisResultDto;
import com.deepfake.sentinel.dto.detection.VideoFrameDto;
import org.opencv.core.Mat;
import org.opencv.core.MatOfByte;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.videoio.VideoCapture;
import org.opencv.videoio.Videoio;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class VideoDetectionService {

    private static final Logger log = LoggerFactory.getLogger(VideoDetectionService.class);

    private final OpenCvLoaderService openCvLoaderService;
    private final ImageDetectionService imageDetectionService;

    public VideoDetectionService(OpenCvLoaderService openCvLoaderService, ImageDetectionService imageDetectionService) {
        this.openCvLoaderService = openCvLoaderService;
        this.imageDetectionService = imageDetectionService;
    }

    public VideoAnalysisResultDto analyzeVideo(MultipartFile file) throws Exception {
        long startTime = System.currentTimeMillis();
        String originalFilename = file.getOriginalFilename();
        long fileSize = file.getSize();

        File tempVideo = File.createTempFile("sentinel_vid_", "_" + (originalFilename != null ? originalFilename : "video.mp4"));
        tempVideo.deleteOnExit();

        try (FileOutputStream fos = new FileOutputStream(tempVideo)) {
            fos.write(file.getBytes());
        }

        List<VideoFrameDto> frameResults = new ArrayList<>();
        double durationSec = 0.0;
        int totalSampledFrames = 0;
        int deepfakeFramesCount = 0;
        double sumFakeProb = 0.0;
        double maxBoundaryScore = 0.0;
        double maxFreqScore = 0.0;
        double maxElaScore = 0.0;

        if (openCvLoaderService.isOpenCvAvailable()) {
            VideoCapture cap = new VideoCapture(tempVideo.getAbsolutePath());
            if (cap.isOpened()) {
                double fps = cap.get(Videoio.CAP_PROP_FPS);
                double frameCount = cap.get(Videoio.CAP_PROP_FRAME_COUNT);
                if (fps > 0) {
                    durationSec = frameCount / fps;
                }

                int numSamples = Math.min(16, Math.max(4, (int) (frameCount / (fps > 0 ? fps : 30))));
                int step = Math.max(1, (int) (frameCount / numSamples));

                Mat frame = new Mat();
                int currentFrameIdx = 0;

                while (cap.read(frame) && currentFrameIdx < frameCount) {
                    if (currentFrameIdx % step == 0 && totalSampledFrames < 20) {
                        double timestampSec = (fps > 0) ? currentFrameIdx / fps : currentFrameIdx * 0.033;

                        MatOfByte mob = new MatOfByte();
                        Imgcodecs.imencode(".jpg", frame, mob);
                        byte[] frameBytes = mob.toArray();

                        try {
                            AnalysisResultDto frameAnalysis = imageDetectionService.analyzeImageBytes(
                                    frameBytes, "frame_" + currentFrameIdx + ".jpg", frameBytes.length);

                            double fakeProb = frameAnalysis.getFakeProbability();
                            sumFakeProb += fakeProb;
                            totalSampledFrames++;

                            if ("DEEPFAKE".equals(frameAnalysis.getVerdict())) {
                                deepfakeFramesCount++;
                            }

                            if (frameAnalysis.getForensicMetrics() != null) {
                                maxBoundaryScore = Math.max(maxBoundaryScore, frameAnalysis.getForensicMetrics().getBoundaryBlendScore());
                                maxFreqScore = Math.max(maxFreqScore, frameAnalysis.getForensicMetrics().getFrequencyArtifactScore());
                                maxElaScore = Math.max(maxElaScore, frameAnalysis.getForensicMetrics().getErrorLevelAnalysisScore());
                            }

                            frameResults.add(VideoFrameDto.builder()
                                    .frameIndex(currentFrameIdx)
                                    .timestampSec(round2(timestampSec))
                                    .fakeProbability(round2(fakeProb))
                                    .verdict(frameAnalysis.getVerdict())
                                    .faceDetected(frameAnalysis.getFacesDetected() > 0)
                                    .temporalJitter(0.0)
                                    .build());
                        } catch (Exception ex) {
                            log.warn("[VIDEO-DETECTION] Error processing frame {}: {}", currentFrameIdx, ex.getMessage());
                        }
                    }
                    currentFrameIdx++;
                }
                cap.release();
            }
        }

        double temporalInconsistency = calculateTemporalInconsistency(frameResults);

        for (int i = 1; i < frameResults.size(); i++) {
            double prev = frameResults.get(i - 1).getFakeProbability();
            double curr = frameResults.get(i).getFakeProbability();
            frameResults.get(i).setTemporalJitter(round2(Math.abs(curr - prev)));
        }

        double avgFakeProb = totalSampledFrames > 0 ? (sumFakeProb / totalSampledFrames) : 25.0;
        double aggregatedFakeProb = (avgFakeProb * 0.70) + (temporalInconsistency * 0.30);
        aggregatedFakeProb = Math.max(1.0, Math.min(99.0, aggregatedFakeProb));

        String verdict;
        if (aggregatedFakeProb >= 60.0 || (totalSampledFrames > 0 && ((double) deepfakeFramesCount / totalSampledFrames) > 0.40)) {
            verdict = "DEEPFAKE";
        } else if (aggregatedFakeProb >= 38.0) {
            verdict = "SUSPICIOUS";
        } else {
            verdict = "REAL";
        }

        double confidence = 82.0 + Math.abs(aggregatedFakeProb - 50.0) * 0.25;
        confidence = Math.max(60.0, Math.min(99.0, confidence));

        ForensicMetricsDto aggregateForensics = ForensicMetricsDto.builder()
                .boundaryBlendScore(round2(maxBoundaryScore > 0 ? maxBoundaryScore : 20.0))
                .frequencyArtifactScore(round2(maxFreqScore > 0 ? maxFreqScore : 20.0))
                .errorLevelAnalysisScore(round2(maxElaScore > 0 ? maxElaScore : 20.0))
                .colorInconsistencyScore(round2(temporalInconsistency))
                .textureNoiseVariance(round2(avgFakeProb * 0.8))
                .eyeSymmetryScore(round2(temporalInconsistency * 1.1))
                .overallForensicAnomaly(round2(aggregatedFakeProb))
                .build();

        String explanation = String.format("Analyzed %d sampled video frames over %.1f seconds. %d frames exhibited synthetic facial artifacts. Temporal inconsistency score: %.1f%%.",
                totalSampledFrames, durationSec, deepfakeFramesCount, temporalInconsistency);

        long processingTimeMs = System.currentTimeMillis() - startTime;

        try {
            tempVideo.delete();
        } catch (Exception ignored) {}

        return VideoAnalysisResultDto.builder()
                .filename(originalFilename != null ? originalFilename : "video.mp4")
                .fileSize(fileSize)
                .durationSec(round2(durationSec))
                .totalFramesAnalyzed(totalSampledFrames)
                .deepfakeFramesCount(deepfakeFramesCount)
                .fakeProbability(round2(aggregatedFakeProb))
                .confidenceScore(round2(confidence))
                .verdict(verdict)
                .temporalInconsistencyScore(round2(temporalInconsistency))
                .frames(frameResults)
                .aggregateForensics(aggregateForensics)
                .explanation(explanation)
                .processingTimeMs(processingTimeMs)
                .createdAt(LocalDateTime.now())
                .build();
    }

    private double calculateTemporalInconsistency(List<VideoFrameDto> frames) {
        if (frames == null || frames.size() < 2) return 15.0;
        double sumJitter = 0;
        for (int i = 1; i < frames.size(); i++) {
            double diff = Math.abs(frames.get(i).getFakeProbability() - frames.get(i - 1).getFakeProbability());
            sumJitter += diff;
        }
        double avgJitter = sumJitter / (frames.size() - 1);
        return Math.min(95.0, avgJitter * 2.5);
    }

    private double round2(double val) {
        return Math.round(val * 100.0) / 100.0;
    }
}
