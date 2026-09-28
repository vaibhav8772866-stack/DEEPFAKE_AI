# Deepfake Sentinel: Quickstart & Deployment Guide

## System Prerequisites

1. **Java Development Kit**: JDK 17, 21, or 26.
2. **Apache Maven**: 3.8+ or 3.9+.
3. **Node.js & npm**: Node v18+ / v20+ / v24+.
4. **MySQL Database**: `MySQL80` service active on `localhost:3306`.

---

## 1. Database Setup

Ensure your local MySQL service is running. The application is configured by default to automatically connect to:
- URL: `jdbc:mysql://localhost:3306/deepfake_sentinel?createDatabaseIfNotExist=true`
- Username: `root`
- Password: `root` (or configured via environment variables `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD`)

Spring Data JPA will automatically create and update the necessary tables (`users`, `analysis_records`, `threat_metrics`).

---

## 2. Running the Java Spring Boot Backend

Open a terminal in `C:\Users\vaibh\Desktop\ll\backend`:

```powershell
cd C:\Users\vaibh\Desktop\ll\backend
mvn clean spring-boot:run
```

The backend server starts on port `8080`.
Verify backend health by visiting: `http://localhost:8080/api/health`

---

## 3. Running the React Frontend

Open a second terminal in `C:\Users\vaibh\Desktop\ll\frontend`:

```powershell
cd C:\Users\vaibh\Desktop\ll\frontend
npm install
npm run dev
```

The frontend Vite server starts on port `5173`.
Open your browser and navigate to: `http://localhost:5173`

---

## 4. Default Seeded Credentials

The application automatically seeds two default accounts on first startup:

| Role | Username | Password | Email |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin` | Configure using `ADMIN_PASSWORD` | `admin@sentinel.ai` |
| **Forensic Analyst** | `analyst` | Configure using `ANALYST_PASSWORD` | `analyst@sentinel.ai` |

You can use the **Quick-Fill** buttons inside the Sign In modal to authenticate instantly.
