# Deepfake Sentinel: AI Model & Inference Specifications

## 1. ONNX Model Contract

- **Model Filename**: `model_q4.onnx`
- **Target Folder**: `C:\Users\vaibh\Desktop\ll\ai-model\models\model_q4.onnx`
- **Model Type**: Quantized Deepfake Facial Classifier (MesoNet / EfficientNet / MobileNet ONNX graph)
- **Input Tensor**:
  - Name: `input` or session primary input name
  - Shape: `[1, 3, 224, 224]` (Batch Size: 1, Channels: 3, Height: 224, Width: 224)
  - Data Type: `FLOAT32`
  - Color Order: RGB
  - Tensor Layout: NCHW
- **Preprocessing / Normalization**:
  - Scaling: Pixel values in `[0.0, 1.0]`
  - Mean Subtraction: `Mean = [0.485, 0.456, 0.406]`
  - Standard Deviation: `Std = [0.229, 0.224, 0.225]`
- **Output Tensor**:
  - Binary logits or 2-class probability vector `[P(Real), P(Fake)]`.

---

## 2. Haar Cascade Face Detection

- **Filename**: `haarcascade_frontalface_default.xml`
- **Target Folder**: `C:\Users\vaibh\Desktop\ll\ai-model\models\haarcascade_frontalface_default.xml`
- **Engine**: OpenCV `CascadeClassifier` Java API
- **Parameters**: `scaleFactor = 1.1`, `minNeighbors = 3`, `minSize = Size(30, 30)`
- **Fallback**: In-JVM skin-tone luminous oval bounding box estimation when the cascade XML is not loaded.

---

## 3. Dynamic Model Hot-Reload

When `model_q4.onnx` is copied into `ai-model/models/model_q4.onnx`, the Spring Boot backend can immediately load the session via:
1. The **Admin Console** "Reload ONNX Model" button.
2. The REST API: `POST /api/detection/reload-model`.
3. Automatic on-demand discovery during any scan invocation.
