package com.deepfake.sentinel.service;

import com.deepfake.sentinel.dto.detection.AnalysisResultDto;
import com.deepfake.sentinel.dto.detection.AudioAnalysisResultDto;
import com.deepfake.sentinel.dto.detection.VideoAnalysisResultDto;
import com.deepfake.sentinel.entity.AnalysisRecord;
import com.deepfake.sentinel.entity.ThreatMetric;
import com.deepfake.sentinel.entity.User;
import com.deepfake.sentinel.repository.AnalysisRecordRepository;
import com.deepfake.sentinel.repository.ThreatMetricRepository;
import com.deepfake.sentinel.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class DetectionService {

    private static final Logger log = LoggerFactory.getLogger(DetectionService.class);

    private final ImageDetectionService imageDetectionService;
    private final VideoDetectionService videoDetectionService;
    private final AudioDetectionService audioDetectionService;
    private final AnalysisRecordRepository recordRepository;
    private final ThreatMetricRepository threatMetricRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public DetectionService(ImageDetectionService imageDetectionService, VideoDetectionService videoDetectionService, AudioDetectionService audioDetectionService, AnalysisRecordRepository recordRepository, ThreatMetricRepository threatMetricRepository, UserRepository userRepository, ObjectMapper objectMapper) {
        this.imageDetectionService = imageDetectionService;
        this.videoDetectionService = videoDetectionService;
        this.audioDetectionService = audioDetectionService;
        this.recordRepository = recordRepository;
        this.threatMetricRepository = threatMetricRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public AnalysisResultDto analyzeImageAndSave(MultipartFile file) throws Exception {
        AnalysisResultDto result = imageDetectionService.analyzeImage(file);
        saveRecord(result.getFilename(), "IMAGE", result.getFileSize(), result.getVerdict(),
                result.getFakeProbability(), result.getConfidenceScore(), result.getFacesDetected(),
                result.getProcessingTimeMs(), result.getExplanation(), result.getForensicMetrics());
        return result;
    }

    @Transactional
    public AnalysisResultDto analyzeImageBytesAndSave(byte[] imageBytes, String filename) throws Exception {
        AnalysisResultDto result = imageDetectionService.analyzeImageBytes(imageBytes, filename, imageBytes.length);
        saveRecord(result.getFilename(), "IMAGE", (long) imageBytes.length, result.getVerdict(),
                result.getFakeProbability(), result.getConfidenceScore(), result.getFacesDetected(),
                result.getProcessingTimeMs(), result.getExplanation(), result.getForensicMetrics());
        return result;
    }

    @Transactional
    public VideoAnalysisResultDto analyzeVideoAndSave(MultipartFile file) throws Exception {
        VideoAnalysisResultDto result = videoDetectionService.analyzeVideo(file);
        saveRecord(result.getFilename(), "VIDEO", result.getFileSize(), result.getVerdict(),
                result.getFakeProbability(), result.getConfidenceScore(), result.getTotalFramesAnalyzed(),
                result.getProcessingTimeMs(), result.getExplanation(), result.getAggregateForensics());
        return result;
    }

    @Transactional
    public AudioAnalysisResultDto analyzeAudioAndSave(MultipartFile file) throws Exception {
        AudioAnalysisResultDto result = audioDetectionService.analyzeAudio(file);
        saveRecord(result.getFilename(), "AUDIO", result.getFileSize(), result.getVerdict(),
                result.getFakeProbability(), result.getConfidenceScore(), 0,
                result.getProcessingTimeMs(), result.getExplanation(), null);
        return result;
    }

    private void saveRecord(String filename, String mediaType, Long fileSize, String verdict,
                            Double fakeProb, Double confidence, Integer faces, Long procTime,
                            String summary, Object metrics) {
        try {
            Long currentUserId = null;
            String currentUsername = "Anonymous";

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
                currentUsername = auth.getName();
                Optional<User> userOpt = userRepository.findByUsername(currentUsername);
                if (userOpt.isPresent()) {
                    currentUserId = userOpt.get().getId();
                }
            }

            String metricsJsonStr = "";
            if (metrics != null) {
                metricsJsonStr = objectMapper.writeValueAsString(metrics);
            }

            AnalysisRecord record = AnalysisRecord.builder()
                    .filename(filename)
                    .mediaType(mediaType)
                    .fileSize(fileSize)
                    .verdict(verdict)
                    .fakeProbability(fakeProb)
                    .confidenceScore(confidence)
                    .facesDetected(faces)
                    .processingTimeMs(procTime)
                    .forensicSummary(summary)
                    .metricsJson(metricsJsonStr)
                    .userId(currentUserId)
                    .username(currentUsername)
                    .createdAt(LocalDateTime.now())
                    .build();

            recordRepository.save(record);
            updateDailyThreatMetric(verdict, confidence);
        } catch (Exception ex) {
            log.error("[DETECTION-SERVICE] Failed to persist scan record: {}", ex.getMessage(), ex);
        }
    }

    private void updateDailyThreatMetric(String verdict, Double confidence) {
        try {
            LocalDate today = LocalDate.now();
            ThreatMetric metric = threatMetricRepository.findByMetricDate(today)
                    .orElseGet(() -> ThreatMetric.builder()
                            .metricDate(today)
                            .totalScans(0L)
                            .deepfakesCount(0L)
                            .realsCount(0L)
                            .suspiciousCount(0L)
                            .avgConfidence(confidence)
                            .build());

            metric.setTotalScans(metric.getTotalScans() + 1);
            if ("DEEPFAKE".equalsIgnoreCase(verdict)) {
                metric.setDeepfakesCount(metric.getDeepfakesCount() + 1);
            } else if ("REAL".equalsIgnoreCase(verdict)) {
                metric.setRealsCount(metric.getRealsCount() + 1);
            } else {
                metric.setSuspiciousCount(metric.getSuspiciousCount() + 1);
            }

            double newAvg = (metric.getAvgConfidence() * (metric.getTotalScans() - 1) + confidence) / metric.getTotalScans();
            metric.setAvgConfidence(Math.round(newAvg * 100.0) / 100.0);

            threatMetricRepository.save(metric);
        } catch (Exception ex) {
            log.warn("[DETECTION-SERVICE] Daily metric update warning: {}", ex.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public Page<AnalysisRecord> getScanHistory(int page, int size, Long userId) {
        Pageable pageable = PageRequest.of(page, size);
        if (userId != null) {
            return recordRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        }
        return recordRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    @Transactional(readOnly = true)
    public Optional<AnalysisRecord> getRecordById(Long id) {
        return recordRepository.findById(id);
    }

    @Transactional
    public boolean deleteRecord(Long id) {
        if (recordRepository.existsById(id)) {
            recordRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
