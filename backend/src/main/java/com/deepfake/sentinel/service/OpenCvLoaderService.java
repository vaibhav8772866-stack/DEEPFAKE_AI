package com.deepfake.sentinel.service;

import jakarta.annotation.PostConstruct;
import nu.pattern.OpenCV;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class OpenCvLoaderService {

    private static final Logger log = LoggerFactory.getLogger(OpenCvLoaderService.class);

    private boolean openCvAvailable = false;
    private String statusMessage = "Uninitialized";

    @PostConstruct
    public void init() {
        try {
            OpenCV.loadLocally();
            openCvAvailable = true;
            statusMessage = "OpenCV 4.7.0 native libraries loaded successfully via OpenPnP.";
            log.info("[OPENCV] {}", statusMessage);
        } catch (Throwable t) {
            openCvAvailable = false;
            statusMessage = "OpenCV native loading fallback: " + t.getMessage();
            log.warn("[OPENCV] Native OpenCV could not be initialized (falling back to pure Java image processing): {}", t.getMessage());
        }
    }

    public boolean isOpenCvAvailable() { return openCvAvailable; }
    public String getStatusMessage() { return statusMessage; }
}
