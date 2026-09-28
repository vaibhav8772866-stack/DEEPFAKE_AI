# 🛡️ Deepfake Sentinel

> Enterprise In-JVM AI Deepfake Detection & Multi-Layer Media Forensics Platform

Deepfake Sentinel is an AI-powered media forensics platform designed to detect manipulated images and videos using an enterprise Java-based architecture.

The system combines Spring Boot, ONNX Runtime Java, OpenCV, MySQL, and React + Vite to provide deepfake detection, forensic analysis, authentication, history, and administrative monitoring.

---

## 🌟 Key Features

### 🧠 AI Deepfake Detection

- ONNX-based deepfake classification
- Java-based ONNX Runtime inference
- OpenCV face detection
- 224 × 224 image preprocessing
- ImageNet normalization
- Deepfake probability estimation

### 📷 Image Analysis

The image detection pipeline includes:

- Face detection
- Face cropping
- ONNX model inference
- Error Level Analysis (ELA)
- Boundary analysis
- Texture analysis
- Frequency analysis
- Confidence estimation

### 🎥 Video Analysis

The video pipeline supports:

- OpenCV VideoCapture
- Frame sampling
- Face detection
- Frame-level analysis
- Temporal analysis
- Result aggregation

### 🎙️ Audio Analysis

Audio forensic indicators include:

- Zero-Crossing Rate
- Frequency analysis
- High-frequency analysis
- Synthetic-audio indicators

> Audio analysis is provided as a forensic indicator and should not be treated as definitive proof.

### 📹 Webcam Detection

The platform supports:

- Live camera preview
- Snapshot capture
- Face detection
- Deepfake analysis
- Result visualization

---

# 🏢 Enterprise Security

Deepfake Sentinel provides:

- JWT authentication
- Role-Based Access Control
- `ROLE_ADMIN`
- `ROLE_USER`
- Spring Security
- Stateless authentication
- Password hashing
- MySQL persistence
- Detection history
- Audit information
- Administrative dashboard

---

# 💻 Technology Stack

## Backend

| Technology | Purpose |
|---|---|
| Java | Core programming language |
| Spring Boot | Backend framework |
| Spring Security | Authentication |
| Spring Data JPA | Database persistence |
| MySQL | Database |
| JWT | Authentication |
| Maven | Build system |

## AI & Computer Vision

| Technology | Purpose |
|---|---|
| ONNX Runtime Java | AI inference |
| ONNX | Deepfake classification model |
| OpenCV Java | Image/video processing |
| Haar Cascade | Face detection |

## Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Frontend build tool |
| JavaScript | Application logic |
| Axios | API communication |
| React Router | Navigation |

---

# 📂 Project Structure

```text
Deepfake-Sentinel/
│
├── .github/
│
├── ai-model/
│   ├── models/
│   │   ├── model_q4.onnx
│   │   └── haarcascade_frontalface_default.xml
│   │
│   └── test-samples/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/deepfake/sentinel/
│   │   │   │
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── models/
│   │   │
│   │   └── test/
│   │
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── docs/
│   ├── API_SPEC.md
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── MODEL_SPECS.md
│
├── tests/
│   └── integration_test.ps1
│
├── .gitattributes
├── .gitignore
└── README.md