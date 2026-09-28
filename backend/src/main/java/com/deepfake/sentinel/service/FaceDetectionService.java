package com.deepfake.sentinel.service;

import com.deepfake.sentinel.dto.detection.FaceBoundingBoxDto;
import jakarta.annotation.PostConstruct;
import org.opencv.core.Mat;
import org.opencv.core.MatOfRect;
import org.opencv.core.Rect;
import org.opencv.core.Size;
import org.opencv.imgproc.Imgproc;
import org.opencv.objdetect.CascadeClassifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Service
public class FaceDetectionService {

    private static final Logger log = LoggerFactory.getLogger(FaceDetectionService.class);

    @Value("${app.ai.cascade-path:ai-model/models/haarcascade_frontalface_default.xml}")
    private String cascadePathConfig;

    private final OpenCvLoaderService openCvLoaderService;
    private CascadeClassifier cascadeClassifier;

    private boolean cascadeLoaded = false;
    private String resolvedCascadePath = "";

    public FaceDetectionService(OpenCvLoaderService openCvLoaderService) {
        this.openCvLoaderService = openCvLoaderService;
    }

    @PostConstruct
    public synchronized void init() {
        if (!openCvLoaderService.isOpenCvAvailable()) {
            log.warn("[FACE-DETECTION] OpenCV not initialized; awaiting OpenCV loader.");
            return;
        }

        File cascadeFile = resolveCascadeFile();
        if (cascadeFile != null && cascadeFile.exists() && cascadeFile.length() > 0) {
            try {
                this.resolvedCascadePath = cascadeFile.getAbsolutePath();
                this.cascadeClassifier = new CascadeClassifier(resolvedCascadePath);
                if (!cascadeClassifier.empty()) {
                    this.cascadeLoaded = true;
                    log.info("===============================================================================");
                    log.info("[OPENCV-FACE] Haar Cascade frontal face model loaded successfully");
                    log.info("[OPENCV-FACE] Cascade Path: {}", resolvedCascadePath);
                    log.info("[OPENCV-FACE] Cascade Size: {} bytes ({} KB)", cascadeFile.length(), cascadeFile.length() / 1024);
                    log.info("===============================================================================");
                } else {
                    this.cascadeLoaded = false;
                    log.warn("[OPENCV-FACE] Cascade file empty or invalid format: {}", resolvedCascadePath);
                }
            } catch (Exception ex) {
                this.cascadeLoaded = false;
                log.warn("[OPENCV-FACE] Error initializing CascadeClassifier: {}", ex.getMessage());
            }
        } else {
            this.cascadeLoaded = false;
            log.info("[OPENCV-FACE] Haar Cascade not found at configured path; heuristic face detection enabled.");
        }
    }

    public synchronized boolean reloadCascade() {
        init();
        return cascadeLoaded;
    }

    public List<FaceBoundingBoxDto> detectFacesMat(Mat imageMat) {
        List<FaceBoundingBoxDto> faces = new ArrayList<>();

        if (cascadeLoaded && cascadeClassifier != null && !cascadeClassifier.empty()) {
            try {
                Mat grayMat = new Mat();
                if (imageMat.channels() == 3) {
                    Imgproc.cvtColor(imageMat, grayMat, Imgproc.COLOR_BGR2GRAY);
                } else {
                    imageMat.copyTo(grayMat);
                }
                Imgproc.equalizeHist(grayMat, grayMat);

                MatOfRect faceDetections = new MatOfRect();
                cascadeClassifier.detectMultiScale(
                        grayMat,
                        faceDetections,
                        1.1,
                        3,
                        0,
                        new Size(30, 30),
                        new Size()
                );

                Rect[] rects = faceDetections.toArray();
                int idx = 1;
                for (Rect r : rects) {
                    faces.add(FaceBoundingBoxDto.builder()
                            .x(r.x)
                            .y(r.y)
                            .width(r.width)
                            .height(r.height)
                            .detectionConfidence(0.95)
                            .label("Face #" + (idx++))
                            .build());
                }

                if (!faces.isEmpty()) {
                    log.debug("[OPENCV-FACE] Localized {} face(s) via OpenCV Haar Cascade", faces.size());
                    return faces;
                }
            } catch (Exception ex) {
                log.warn("[OPENCV-FACE] Detection error during Haar cascade scan: {}", ex.getMessage());
            }
        }

        return faces;
    }

    public List<FaceBoundingBoxDto> detectFacesFallback(BufferedImage image) {
        List<FaceBoundingBoxDto> faces = new ArrayList<>();
        int w = image.getWidth();
        int h = image.getHeight();

        int faceW = (int) (w * 0.50);
        int faceH = (int) (h * 0.55);
        int faceX = Math.max(0, (w - faceW) / 2);
        int faceY = Math.max(0, (int) (h * 0.18));

        faces.add(FaceBoundingBoxDto.builder()
                .x(faceX)
                .y(faceY)
                .width(faceW)
                .height(faceH)
                .detectionConfidence(0.85)
                .label("Primary Subject (Heuristic)")
                .build());

        return faces;
    }

    private File resolveCascadeFile() {
        String[] candidatePaths = new String[]{
                cascadePathConfig,
                "ai-model/models/haarcascade_frontalface_default.xml",
                "../ai-model/models/haarcascade_frontalface_default.xml",
                "C:\\Users\\vaibh\\Desktop\\ll\\ai-model\\models\\haarcascade_frontalface_default.xml"
        };

        for (String p : candidatePaths) {
            File f = new File(p);
            if (f.exists() && f.isFile() && f.length() > 0) {
                return f;
            }
        }
        return new File("ai-model/models/haarcascade_frontalface_default.xml");
    }

    public boolean isCascadeLoaded() { return cascadeLoaded; }
    public String getResolvedCascadePath() { return resolvedCascadePath; }
}
