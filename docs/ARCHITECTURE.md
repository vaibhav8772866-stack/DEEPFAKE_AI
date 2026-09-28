# Deepfake Sentinel: System Architecture Specification

## 1. Executive Overview

Deepfake Sentinel is a high-performance, enterprise-grade AI media forensics and deepfake detection platform. The system is engineered to execute deep learning neural network inference **directly inside the Java Virtual Machine (JVM)** via Microsoft ONNX Runtime for Java and OpenCV Java, eliminating any dependency on external Python processes, Flask, FastAPI, or detached microservices.

```
+-----------------------------------------------------------------------+
|                           REACT FRONTEND                              |
|   (Vite + React 18 + Cyberpunk Forensics UI + Real-time WebCam Lens)   |
+-----------------------------------^-----------------------------------+
                                    | REST / JSON / Multipart
                                    v
+-----------------------------------------------------------------------+
|                    JAVA SPRING BOOT 3 REST BACKEND                    |
|                                                                       |
|  +---------------------+  +--------------------+  +----------------+  |
|  | Spring Security 6   |  | Spring Data JPA    |  | Admin & RBAC   |  |
|  | Stateless JWT Auth  |  | MySQL Persistence  |  | User Governance|  |
|  +---------------------+  +--------------------+  +----------------+  |
|                                                                       |
|  +-----------------------------------------------------------------+  |
|  |                 IN-JVM FORENSIC & AI ENGINE                     |  |
|  |                                                                 |  |
|  |  [OpenCV 4.7 Java]                                              |  |
|  |  - Face Localization (Haar Cascades & Geometric Ovals)          |  |
|  |  - Frame Extraction from MP4/AVI VideoCapture Streams           |  |
|  |                                                                 |  |
|  |  [Multi-Layer Forensic Spectrum Analyzer]                       |  |
|  |  - Error Level Analysis (ELA) Compression Residual              |  |
|  |  - Boundary Blending & Laplacian 2nd-Derivative Seams          |  |
|  |  - High-Frequency Fourier / DCT Spatial Grid Artifacts         |  |
|  |  - Chrominance (Cb/Cr) Channel Divergence                       |  |
|  |  - Micro-Texture Skin Pore Smoothing vs Noise                   |  |
|  |  - Ocular & Orbital Landmark Symmetry                           |  |
|  |                                                                 |  |
|  |  [Microsoft ONNX Runtime Java]                                  |  |
|  |  - Model: model_q4.onnx (Quantized Deepfake Classifier)         |  |
|  |  - Input Tensor: [1, 3, 224, 224] NCHW Float32                  |  |
|  |  - Normalization: ImageNet Mean & Standard Deviation            |  |
|  |  - Output: Binary Logits / Softmax Synthetic Probability        |  |
|  +-----------------------------------------------------------------+  |
+-----------------------------------^-----------------------------------+
                                    | JDBC (HikariCP)
                                    v
+-----------------------------------------------------------------------+
|                       MYSQL RELATIONAL DATABASE                       |
|   - Table: users (Credentials, Roles, Status)                         |
|   - Table: analysis_records (Scan logs, Probabilities, JSON vectors)   |
|   - Table: threat_metrics (Daily aggregated timelines & accuracy)     |
+-----------------------------------------------------------------------+
```

---

## 2. In-JVM AI Inference Pipeline

1. **Media Ingestion**:
   - The user submits an image (JPG, PNG, WEBP), video (MP4, AVI, WEBM), audio (WAV, MP3), or webcam frame via HTTP Multipart or Base64 payload.
2. **Optical / Face Extraction**:
   - OpenCV decodes raw image bytes into an in-memory `Mat`.
   - `FaceDetectionService` applies `CascadeClassifier` (`haarcascade_frontalface_default.xml`) or heuristic facial oval localization to extract primary and secondary face regions.
3. **Tensor Construction**:
   - The face region is rescaled to $224 \times 224$ pixels using bilinear interpolation.
   - Normalized into 3-channel NCHW float array:
     $$\text{Tensor}[c, y, x] = \frac{\text{Pixel}[c, y, x] - \mu_c}{\sigma_c}$$
     where $\mu = [0.485, 0.456, 0.406]$ and $\sigma = [0.229, 0.224, 0.225]$.
4. **ONNX Forward Pass**:
   - An `OnnxTensor` is instantiated via `OrtEnvironment`.
   - `OrtSession.run()` executes the quantized graph with active graph optimizations.
   - The output vector is passed through softmax/sigmoid to yield neural deepfake probability $P_{ONNX}$.
5. **Multi-Layer Computer Vision Forensics**:
   - **ELA**: Measures residual error variance between original and 90% re-compressed JPEG images to spot digital splicing.
   - **Boundary Laplacian**: Measures 2nd derivative edge transitions along the face boundary bounding box. Face swaps exhibit marked gradient softening at blend boundaries.
   - **Frequency Spectrum**: Measures high-frequency spatial energy ratio. Generative diffusion and GAN models exhibit distinctive checkerboard frequency grid anomalies.
   - **Color Balance**: Evaluates RGB/YCbCr chrominance standard deviation across the face vs surrounding context.
   - **Texture Noise Variance**: Calculates standard deviation in $8\times 8$ pixel patches, capturing synthetic over-smoothing.
6. **Ensemble Synthesis & Classification**:
   - Final Probability:
     $$P_{\text{Final}} = 0.60 \times P_{\text{ONNX}} + 0.40 \times P_{\text{Forensics}}$$
   - Decision Boundaries:
     - $P_{\text{Final}} \ge 62.0\% \implies \text{\textbf{DEEPFAKE}}$
     - $38.0\% \le P_{\text{Final}} < 62.0\% \implies \text{\textbf{SUSPICIOUS}}$
     - $P_{\text{Final}} < 38.0\% \implies \text{\textbf{REAL}}$
