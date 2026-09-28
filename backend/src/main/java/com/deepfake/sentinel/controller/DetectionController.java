package com.deepfake.sentinel.controller;

import com.deepfake.sentinel.dto.detection.AnalysisResultDto;
import com.deepfake.sentinel.dto.detection.AudioAnalysisResultDto;
import com.deepfake.sentinel.dto.detection.ModelStatusDto;
import com.deepfake.sentinel.dto.detection.VideoAnalysisResultDto;
import com.deepfake.sentinel.entity.AnalysisRecord;
import com.deepfake.sentinel.entity.Role;
import com.deepfake.sentinel.entity.User;
import com.deepfake.sentinel.repository.UserRepository;
import com.deepfake.sentinel.service.DetectionService;
import com.deepfake.sentinel.service.OnnxInferenceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/detection")
public class DetectionController {

    private static final Logger log = LoggerFactory.getLogger(DetectionController.class);

    private final DetectionService detectionService;
    private final OnnxInferenceService onnxInferenceService;
    private final UserRepository userRepository;

    public DetectionController(DetectionService detectionService, OnnxInferenceService onnxInferenceService, UserRepository userRepository) {
        this.detectionService = detectionService;
        this.onnxInferenceService = onnxInferenceService;
        this.userRepository = userRepository;
    }

    @PostMapping("/analyze-image")
    public ResponseEntity<?> analyzeImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Please provide a non-empty image file."));
            }
            AnalysisResultDto result = detectionService.analyzeImageAndSave(file);
            return ResponseEntity.ok(result);
        } catch (Exception ex) {
            log.error("[API] Image analysis failed: {}", ex.getMessage(), ex);
            return ResponseEntity.internalServerError().body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/analyze-webcam-frame")
    public ResponseEntity<?> analyzeWebcamFrame(@RequestBody Map<String, String> payload) {
        try {
            String base64Image = payload.get("image");
            if (base64Image == null || base64Image.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Image payload missing"));
            }

            if (base64Image.contains(",")) {
                base64Image = base64Image.substring(base64Image.indexOf(",") + 1);
            }

            byte[] decoded = Base64.getDecoder().decode(base64Image);
            AnalysisResultDto result = detectionService.analyzeImageBytesAndSave(decoded, "webcam_capture.jpg");
            return ResponseEntity.ok(result);
        } catch (Exception ex) {
            log.error("[API] Webcam frame analysis failed: {}", ex.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/analyze-video")
    public ResponseEntity<?> analyzeVideo(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Please provide a non-empty video file."));
            }
            VideoAnalysisResultDto result = detectionService.analyzeVideoAndSave(file);
            return ResponseEntity.ok(result);
        } catch (Exception ex) {
            log.error("[API] Video analysis failed: {}", ex.getMessage(), ex);
            return ResponseEntity.internalServerError().body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/analyze-audio")
    public ResponseEntity<?> analyzeAudio(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Please provide a non-empty audio file."));
            }
            AudioAnalysisResultDto result = detectionService.analyzeAudioAndSave(file);
            return ResponseEntity.ok(result);
        } catch (Exception ex) {
            log.error("[API] Audio analysis failed: {}", ex.getMessage(), ex);
            return ResponseEntity.internalServerError().body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/model-status")
    public ResponseEntity<ModelStatusDto> getModelStatus() {
        return ResponseEntity.ok(onnxInferenceService.getModelStatus());
    }

    @PostMapping("/reload-model")
    public ResponseEntity<ModelStatusDto> reloadModel() {
        onnxInferenceService.reloadModel();
        return ResponseEntity.ok(onnxInferenceService.getModelStatus());
    }

    @GetMapping("/history")
    public ResponseEntity<Page<AnalysisRecord>> getScanHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            Authentication authentication) {

        Long userId = null;
        if (authentication != null && authentication.isAuthenticated()) {
            Optional<User> u = userRepository.findByUsername(authentication.getName());
            if (u.isPresent() && u.get().getRole() != Role.ROLE_ADMIN) {
                userId = u.get().getId();
            }
        }
        return ResponseEntity.ok(detectionService.getScanHistory(page, size, userId));
    }

    @GetMapping("/history/{id}")
    public ResponseEntity<?> getRecordById(@PathVariable Long id) {
        return detectionService.getRecordById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/history/{id}")
    public ResponseEntity<?> deleteRecord(@PathVariable Long id) {
        boolean deleted = detectionService.deleteRecord(id);
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Record deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
