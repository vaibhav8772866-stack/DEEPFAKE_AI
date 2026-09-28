package com.deepfake.sentinel.controller;

import com.deepfake.sentinel.dto.stats.DashboardStatsDto;
import com.deepfake.sentinel.service.StatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(statsService.getDashboardStats());
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardStatsDto> getSummaryStats() {
        return ResponseEntity.ok(statsService.getDashboardStats());
    }
}
