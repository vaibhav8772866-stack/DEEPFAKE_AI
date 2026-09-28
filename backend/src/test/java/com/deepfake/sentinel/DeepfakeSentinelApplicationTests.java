package com.deepfake.sentinel;

import com.deepfake.sentinel.dto.detection.AnalysisResultDto;
import com.deepfake.sentinel.service.ForensicsEngineService;
import com.deepfake.sentinel.service.ImageDetectionService;
import com.deepfake.sentinel.service.OnnxInferenceService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class DeepfakeSentinelApplicationTests {

    @Autowired
    private ImageDetectionService imageDetectionService;

    @Autowired
    private ForensicsEngineService forensicsEngineService;

    @Autowired
    private OnnxInferenceService onnxInferenceService;

    @Test
    void contextLoads() {
        assertNotNull(imageDetectionService);
        assertNotNull(forensicsEngineService);
        assertNotNull(onnxInferenceService);
    }

    @Test
    void testForensicsAnalysis() throws Exception {
        // Create an in-memory 200x200 test image
        BufferedImage img = new BufferedImage(200, 200, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = img.createGraphics();
        g.setColor(new Color(240, 200, 180)); // Skin tone base
        g.fillRect(0, 0, 200, 200);
        g.setColor(new Color(40, 30, 20));
        g.fillOval(50, 60, 25, 20); // Left eye
        g.fillOval(125, 60, 25, 20); // Right eye
        g.setColor(new Color(180, 50, 50));
        g.fillOval(75, 140, 50, 20); // Mouth
        g.dispose();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(img, "jpg", baos);
        byte[] bytes = baos.toByteArray();

        AnalysisResultDto result = imageDetectionService.analyzeImageBytes(bytes, "test_synthetic.jpg", bytes.length);
        assertNotNull(result);
        assertNotNull(result.getVerdict());
        assertTrue(result.getFakeProbability() >= 0.0 && result.getFakeProbability() <= 100.0);
        assertTrue(result.getConfidenceScore() >= 50.0);
        assertNotNull(result.getForensicMetrics());
    }
}
