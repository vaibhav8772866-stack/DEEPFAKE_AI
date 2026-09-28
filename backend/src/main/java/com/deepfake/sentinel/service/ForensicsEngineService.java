package com.deepfake.sentinel.service;

import com.deepfake.sentinel.dto.detection.FaceBoundingBoxDto;
import com.deepfake.sentinel.dto.detection.ForensicMetricsDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.Iterator;
import java.util.List;

@Service
public class ForensicsEngineService {

    private static final Logger log = LoggerFactory.getLogger(ForensicsEngineService.class);

    public ForensicMetricsDto analyzeForensics(BufferedImage image, List<FaceBoundingBoxDto> faces) {
        double elaScore = computeErrorLevelAnalysisScore(image);
        double boundaryScore = computeBoundaryBlendScore(image, faces);
        double freqScore = computeFrequencyArtifactScore(image);
        double colorScore = computeColorInconsistencyScore(image, faces);
        double textureScore = computeTextureNoiseVariance(image, faces);
        double eyeScore = computeEyeSymmetryScore(image, faces);

        double overallScore = (elaScore * 0.25) +
                (boundaryScore * 0.25) +
                (freqScore * 0.20) +
                (colorScore * 0.10) +
                (textureScore * 0.10) +
                (eyeScore * 0.10);

        overallScore = Math.max(0.0, Math.min(100.0, overallScore));

        return ForensicMetricsDto.builder()
                .errorLevelAnalysisScore(round2(elaScore))
                .boundaryBlendScore(round2(boundaryScore))
                .frequencyArtifactScore(round2(freqScore))
                .colorInconsistencyScore(round2(colorScore))
                .textureNoiseVariance(round2(textureScore))
                .eyeSymmetryScore(round2(eyeScore))
                .overallForensicAnomaly(round2(overallScore))
                .build();
    }

    public double computeErrorLevelAnalysisScore(BufferedImage original) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpg");
            if (!writers.hasNext()) return 25.0;

            ImageWriter writer = writers.next();
            ImageOutputStream ios = ImageIO.createImageOutputStream(baos);
            writer.setOutput(ios);

            ImageWriteParam param = writer.getDefaultWriteParam();
            if (param.canWriteCompressed()) {
                param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                param.setCompressionQuality(0.90f);
            }
            writer.write(null, new IIOImage(original, null, null), param);
            ios.close();
            writer.dispose();

            BufferedImage resaved = ImageIO.read(new ByteArrayInputStream(baos.toByteArray()));
            if (resaved == null) return 25.0;

            int w = Math.min(original.getWidth(), resaved.getWidth());
            int h = Math.min(original.getHeight(), resaved.getHeight());
            double totalDiff = 0;
            int sampleCount = 0;

            for (int y = 0; y < h; y += 4) {
                for (int x = 0; x < w; x += 4) {
                    int rgb1 = original.getRGB(x, y);
                    int rgb2 = resaved.getRGB(x, y);

                    int rDiff = Math.abs(((rgb1 >> 16) & 0xFF) - ((rgb2 >> 16) & 0xFF));
                    int gDiff = Math.abs(((rgb1 >> 8) & 0xFF) - ((rgb2 >> 8) & 0xFF));
                    int bDiff = Math.abs((rgb1 & 0xFF) - (rgb2 & 0xFF));

                    double pixelDiff = (rDiff + gDiff + bDiff) / 3.0;
                    totalDiff += pixelDiff;
                    sampleCount++;
                }
            }

            if (sampleCount == 0) return 25.0;
            double avgDiff = totalDiff / sampleCount;

            if (avgDiff > 12.0) {
                return Math.min(95.0, 50.0 + (avgDiff - 12.0) * 4.0);
            } else if (avgDiff < 1.5) {
                return 65.0;
            } else {
                return Math.max(10.0, avgDiff * 4.0);
            }
        } catch (Exception ex) {
            log.warn("[FORENSICS] ELA error: {}", ex.getMessage());
            return 30.0;
        }
    }

    public double computeBoundaryBlendScore(BufferedImage image, List<FaceBoundingBoxDto> faces) {
        if (faces == null || faces.isEmpty()) return 20.0;

        int w = image.getWidth();
        int h = image.getHeight();
        double maxBoundaryDisparity = 0;

        for (FaceBoundingBoxDto face : faces) {
            int fx = Math.max(2, face.getX());
            int fy = Math.max(2, face.getY());
            int fw = Math.min(w - fx - 2, face.getWidth());
            int fh = Math.min(h - fy - 2, face.getHeight());

            if (fw <= 4 || fh <= 4) continue;

            double borderGradSum = 0;
            int borderCount = 0;

            for (int x = fx; x < fx + fw; x += 2) {
                borderGradSum += calcLaplacianPixel(image, x, fy);
                borderGradSum += calcLaplacianPixel(image, x, fy + fh - 1);
                borderCount += 2;
            }

            for (int y = fy; y < fy + fh; y += 2) {
                borderGradSum += calcLaplacianPixel(image, fx, y);
                borderGradSum += calcLaplacianPixel(image, fx + fw - 1, y);
                borderCount += 2;
            }

            double interiorGradSum = 0;
            int interiorCount = 0;
            for (int y = fy + fh / 4; y < fy + 3 * fh / 4; y += 4) {
                for (int x = fx + fw / 4; x < fx + 3 * fw / 4; x += 4) {
                    interiorGradSum += calcLaplacianPixel(image, x, y);
                    interiorCount++;
                }
            }

            double avgBorder = borderCount > 0 ? borderGradSum / borderCount : 10.0;
            double avgInterior = interiorCount > 0 ? interiorGradSum / interiorCount : 10.0;

            double ratio = avgInterior > 0 ? avgBorder / avgInterior : 1.0;
            if (ratio > 2.2 || ratio < 0.45) {
                double faceScore = Math.min(95.0, 45.0 + Math.abs(ratio - 1.0) * 35.0);
                maxBoundaryDisparity = Math.max(maxBoundaryDisparity, faceScore);
            } else {
                maxBoundaryDisparity = Math.max(maxBoundaryDisparity, Math.min(40.0, ratio * 20.0));
            }
        }

        return maxBoundaryDisparity > 0 ? maxBoundaryDisparity : 22.0;
    }

    public double computeFrequencyArtifactScore(BufferedImage image) {
        int w = image.getWidth();
        int h = image.getHeight();
        double highFreqEnergy = 0;
        double totalEnergy = 0;
        int count = 0;

        for (int y = 1; y < h - 1; y += 4) {
            for (int x = 1; x < w - 1; x += 4) {
                int c = getLuminance(image.getRGB(x, y));
                int left = getLuminance(image.getRGB(x - 1, y));
                int right = getLuminance(image.getRGB(x + 1, y));
                int top = getLuminance(image.getRGB(x, y - 1));
                int bottom = getLuminance(image.getRGB(x, y + 1));

                double dx = Math.abs(right - left);
                double dy = Math.abs(bottom - top);
                double gradient = Math.sqrt(dx * dx + dy * dy);

                totalEnergy += c;
                highFreqEnergy += gradient;
                count++;
            }
        }

        if (count == 0 || totalEnergy == 0) return 20.0;
        double ratio = (highFreqEnergy / totalEnergy) * 100.0;

        if (ratio > 45.0) {
            return Math.min(92.0, 50.0 + (ratio - 45.0) * 2.0);
        } else if (ratio < 4.0) {
            return 70.0;
        } else {
            return Math.max(12.0, ratio * 0.7);
        }
    }

    public double computeColorInconsistencyScore(BufferedImage image, List<FaceBoundingBoxDto> faces) {
        if (faces == null || faces.isEmpty()) return 18.0;

        double maxDiscrepancy = 0;
        for (FaceBoundingBoxDto face : faces) {
            int fx = Math.max(0, face.getX());
            int fy = Math.max(0, face.getY());
            int fw = Math.min(image.getWidth() - fx, face.getWidth());
            int fh = Math.min(image.getHeight() - fy, face.getHeight());

            double rSum = 0, gSum = 0, bSum = 0;
            int count = 0;

            for (int y = fy; y < fy + fh; y += 3) {
                for (int x = fx; x < fx + fw; x += 3) {
                    int rgb = image.getRGB(x, y);
                    rSum += (rgb >> 16) & 0xFF;
                    gSum += (rgb >> 8) & 0xFF;
                    bSum += rgb & 0xFF;
                    count++;
                }
            }

            if (count == 0) continue;
            double avgR = rSum / count;
            double avgG = gSum / count;
            double avgB = bSum / count;

            double diffRG = Math.abs(avgR - avgG);
            double diffRB = Math.abs(avgR - avgB);

            if (avgR < avgG || avgR < avgB || diffRG > 90 || diffRB > 120) {
                maxDiscrepancy = Math.max(maxDiscrepancy, 75.0);
            } else {
                maxDiscrepancy = Math.max(maxDiscrepancy, 15.0 + (diffRG * 0.2));
            }
        }

        return maxDiscrepancy > 0 ? maxDiscrepancy : 20.0;
    }

    public double computeTextureNoiseVariance(BufferedImage image, List<FaceBoundingBoxDto> faces) {
        int w = image.getWidth();
        int h = image.getHeight();
        double varianceSum = 0;
        int blocks = 0;

        for (int by = 0; by < h - 8; by += 16) {
            for (int bx = 0; bx < w - 8; bx += 16) {
                double sum = 0, sqSum = 0;
                for (int y = 0; y < 8; y++) {
                    for (int x = 0; x < 8; x++) {
                        int lum = getLuminance(image.getRGB(bx + x, by + y));
                        sum += lum;
                        sqSum += lum * lum;
                    }
                }
                double mean = sum / 64.0;
                double var = (sqSum / 64.0) - (mean * mean);
                varianceSum += Math.max(0, var);
                blocks++;
            }
        }

        if (blocks == 0) return 20.0;
        double avgVar = varianceSum / blocks;

        if (avgVar < 8.0) {
            return 72.0;
        } else if (avgVar > 550.0) {
            return 78.0;
        } else {
            return Math.max(10.0, Math.min(45.0, avgVar * 0.08));
        }
    }

    public double computeEyeSymmetryScore(BufferedImage image, List<FaceBoundingBoxDto> faces) {
        if (faces == null || faces.isEmpty()) return 15.0;

        FaceBoundingBoxDto primary = faces.get(0);
        int fx = Math.max(0, primary.getX());
        int fy = Math.max(0, primary.getY());
        int fw = Math.min(image.getWidth() - fx, primary.getWidth());
        int fh = Math.min(image.getHeight() - fy, primary.getHeight());

        if (fw < 20 || fh < 20) return 15.0;

        int eyeY = fy + (int) (fh * 0.32);
        int eyeH = (int) (fh * 0.18);
        int leftEyeX = fx + (int) (fw * 0.15);
        int eyeW = (int) (fw * 0.30);
        int rightEyeX = fx + (int) (fw * 0.55);

        double leftEyeEnergy = calcRegionLuminanceVar(image, leftEyeX, eyeY, eyeW, eyeH);
        double rightEyeEnergy = calcRegionLuminanceVar(image, rightEyeX, eyeY, eyeW, eyeH);

        double diff = Math.abs(leftEyeEnergy - rightEyeEnergy);
        double maxEnergy = Math.max(1.0, Math.max(leftEyeEnergy, rightEyeEnergy));
        double asymmetryRatio = diff / maxEnergy;

        if (asymmetryRatio > 0.65) {
            return Math.min(90.0, 50.0 + asymmetryRatio * 40.0);
        } else {
            return Math.max(10.0, asymmetryRatio * 30.0);
        }
    }

    private double calcRegionLuminanceVar(BufferedImage img, int rx, int ry, int rw, int rh) {
        rx = Math.max(0, Math.min(img.getWidth() - 1, rx));
        ry = Math.max(0, Math.min(img.getHeight() - 1, ry));
        rw = Math.min(img.getWidth() - rx, rw);
        rh = Math.min(img.getHeight() - ry, rh);

        double sum = 0, sqSum = 0;
        int count = 0;
        for (int y = ry; y < ry + rh; y += 2) {
            for (int x = rx; x < rx + rw; x += 2) {
                int lum = getLuminance(img.getRGB(x, y));
                sum += lum;
                sqSum += lum * lum;
                count++;
            }
        }
        if (count == 0) return 1.0;
        double mean = sum / count;
        return Math.max(0, (sqSum / count) - (mean * mean));
    }

    private double calcLaplacianPixel(BufferedImage img, int x, int y) {
        int x0 = Math.max(0, x - 1), x1 = x, x2 = Math.min(img.getWidth() - 1, x + 1);
        int y0 = Math.max(0, y - 1), y1 = y, y2 = Math.min(img.getHeight() - 1, y + 1);

        int center = getLuminance(img.getRGB(x1, y1));
        int top = getLuminance(img.getRGB(x1, y0));
        int bottom = getLuminance(img.getRGB(x1, y2));
        int left = getLuminance(img.getRGB(x0, y1));
        int right = getLuminance(img.getRGB(x2, y1));

        return Math.abs((4 * center) - (top + bottom + left + right));
    }

    private int getLuminance(int rgb) {
        int r = (rgb >> 16) & 0xFF;
        int g = (rgb >> 8) & 0xFF;
        int b = rgb & 0xFF;
        return (int) (0.299 * r + 0.587 * g + 0.114 * b);
    }

    private double round2(double val) {
        return Math.round(val * 100.0) / 100.0;
    }
}
