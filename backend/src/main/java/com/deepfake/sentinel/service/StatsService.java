package com.deepfake.sentinel.service;

import com.deepfake.sentinel.dto.stats.DashboardStatsDto;
import com.deepfake.sentinel.entity.ThreatMetric;
import com.deepfake.sentinel.repository.AnalysisRecordRepository;
import com.deepfake.sentinel.repository.ThreatMetricRepository;
import com.deepfake.sentinel.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
public class StatsService {

    private final AnalysisRecordRepository recordRepository;
    private final ThreatMetricRepository threatMetricRepository;
    private final UserRepository userRepository;

    public StatsService(AnalysisRecordRepository recordRepository, ThreatMetricRepository threatMetricRepository, UserRepository userRepository) {
        this.recordRepository = recordRepository;
        this.threatMetricRepository = threatMetricRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        long totalScans = recordRepository.count();
        long totalDeepfakes = recordRepository.countByVerdict("DEEPFAKE");
        long totalReals = recordRepository.countByVerdict("REAL");
        long totalSuspicious = recordRepository.countByVerdict("SUSPICIOUS");
        long totalUsers = userRepository.count();

        Double avgConf = recordRepository.getAverageConfidenceScore();
        double averageConfidence = avgConf != null ? Math.round(avgConf * 100.0) / 100.0 : 88.5;

        double deepfakePercentage = totalScans > 0 ?
                Math.round(((double) totalDeepfakes / totalScans) * 10000.0) / 100.0 : 0.0;

        Map<String, Long> mediaCounts = new HashMap<>();
        mediaCounts.put("IMAGE", recordRepository.countByMediaType("IMAGE"));
        mediaCounts.put("VIDEO", recordRepository.countByMediaType("VIDEO"));
        mediaCounts.put("AUDIO", recordRepository.countByMediaType("AUDIO"));

        List<ThreatMetric> metrics = threatMetricRepository.findTop30ByOrderByMetricDateDesc();
        List<DashboardStatsDto.DailyScanMetricDto> timeline = new ArrayList<>();

        if (metrics.isEmpty()) {
            LocalDate now = LocalDate.now();
            for (int i = 6; i >= 0; i--) {
                LocalDate d = now.minusDays(i);
                timeline.add(DashboardStatsDto.DailyScanMetricDto.builder()
                        .date(d.toString())
                        .total(0)
                        .deepfakes(0)
                        .reals(0)
                        .suspicious(0)
                        .build());
            }
        } else {
            for (ThreatMetric tm : metrics) {
                timeline.add(DashboardStatsDto.DailyScanMetricDto.builder()
                        .date(tm.getMetricDate().toString())
                        .total(tm.getTotalScans())
                        .deepfakes(tm.getDeepfakesCount())
                        .reals(tm.getRealsCount())
                        .suspicious(tm.getSuspiciousCount())
                        .build());
            }
            Collections.reverse(timeline);
        }

        return DashboardStatsDto.builder()
                .totalScans(totalScans)
                .totalDeepfakes(totalDeepfakes)
                .totalReals(totalReals)
                .totalSuspicious(totalSuspicious)
                .deepfakePercentage(deepfakePercentage)
                .averageConfidence(averageConfidence)
                .totalUsers(totalUsers)
                .scansByMediaType(mediaCounts)
                .timeline(timeline)
                .build();
    }
}
