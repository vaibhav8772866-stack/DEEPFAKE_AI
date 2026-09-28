package com.deepfake.sentinel.controller;

import com.deepfake.sentinel.config.DataSourceConfig;
import com.deepfake.sentinel.service.OnnxInferenceService;
import com.deepfake.sentinel.service.OpenCvLoaderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final OpenCvLoaderService openCvLoaderService;
    private final OnnxInferenceService onnxInferenceService;
    private final DataSourceConfig dataSourceConfig;

    public HealthController(OpenCvLoaderService openCvLoaderService,
                            OnnxInferenceService onnxInferenceService,
                            DataSourceConfig dataSourceConfig) {
        this.openCvLoaderService = openCvLoaderService;
        this.onnxInferenceService = onnxInferenceService;
        this.dataSourceConfig = dataSourceConfig;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHealthStatus() {
        Map<String, Object> health = new LinkedHashMap<>();
        boolean modelLoaded = onnxInferenceService.isModelLoaded();

        health.put("status", "UP");
        health.put("service", "Deepfake Sentinel Backend");
        health.put("database", dataSourceConfig.getActiveDatabaseType());
        health.put("openCvLoaded", openCvLoaderService.isOpenCvAvailable());
        health.put("onnxModelLoaded", modelLoaded);
        health.put("aiInferenceMode", modelLoaded ? "ONNX_REAL_INFERENCE" : "STANDBY_FORENSICS");
        health.put("timestamp", LocalDateTime.now());

        return ResponseEntity.ok(health);
    }
}

