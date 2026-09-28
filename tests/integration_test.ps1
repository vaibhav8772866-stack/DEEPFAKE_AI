# Deepfake Sentinel Integration Test Script

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "DEEPFAKE SENTINEL: AUTOMATED INTEGRATION TEST" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:8080/api"

# --------------------------------------------------
# Configuration
# --------------------------------------------------

# Admin credentials must be supplied through environment variables.
# Example:
# $env:ADMIN_USERNAME="admin"
# $env:ADMIN_PASSWORD="your-secure-admin-password"

$adminUsername = if ([string]::IsNullOrWhiteSpace($env:ADMIN_USERNAME)) {
    "admin"
} else {
    $env:ADMIN_USERNAME
}

if ([string]::IsNullOrWhiteSpace($env:ADMIN_PASSWORD)) {
    Write-Host "ADMIN_PASSWORD environment variable is not set." -ForegroundColor Red
    Write-Host "Set it before running the integration test." -ForegroundColor Yellow
    Write-Host 'Example: $env:ADMIN_PASSWORD="your-secure-admin-password"' -ForegroundColor Yellow
    exit 1
}

# --------------------------------------------------
# 1. Health Probe
# --------------------------------------------------

Write-Host "`n[1/5] Testing /api/health endpoint..." -ForegroundColor Yellow

try {
    $health = Invoke-RestMethod `
        -Uri "$baseUrl/health" `
        -Method Get `
        -TimeoutSec 10

    Write-Host `
        "Health Status: $($health.status) | OpenCV Loaded: $($health.openCvLoaded) | AI Mode: $($health.aiInferenceMode)" `
        -ForegroundColor Green
}
catch {
    Write-Host `
        "Failed to reach health endpoint. Is the backend running? ($($_.Exception.Message))" `
        -ForegroundColor Red

    exit 1
}

# --------------------------------------------------
# 2. Model Status Probe
# --------------------------------------------------

Write-Host "`n[2/5] Testing /api/detection/model-status..." -ForegroundColor Yellow

try {
    $model = Invoke-RestMethod `
        -Uri "$baseUrl/detection/model-status" `
        -Method Get `
        -TimeoutSec 10

    Write-Host `
        "Engine: $($model.inferenceEngine) | Status: $($model.statusMessage)" `
        -ForegroundColor Green
}
catch {
    Write-Host `
        "Model status probe failed: $($_.Exception.Message)" `
        -ForegroundColor Red
}

# --------------------------------------------------
# 3. Authentication & JWT Token Acquisition
# --------------------------------------------------

Write-Host "`n[3/5] Testing /api/auth/login (Admin)..." -ForegroundColor Yellow

$loginPayload = @{
    usernameOrEmail = $adminUsername
    password        = $env:ADMIN_PASSWORD
} | ConvertTo-Json

try {
    $authRes = Invoke-RestMethod `
        -Uri "$baseUrl/auth/login" `
        -Method Post `
        -Body $loginPayload `
        -ContentType "application/json"

    $token = $authRes.token

    if ([string]::IsNullOrWhiteSpace($token)) {
        throw "Login succeeded but no JWT token was returned."
    }

    Write-Host `
        "JWT Token Acquired for user: $($authRes.user.username) (Role: $($authRes.user.role))" `
        -ForegroundColor Green
}
catch {
    Write-Host `
        "Authentication failed: $($_.Exception.Message)" `
        -ForegroundColor Red

    exit 1
}

# --------------------------------------------------
# 4. Admin RBAC User List Query
# --------------------------------------------------

Write-Host "`n[4/5] Testing /api/admin/users (RBAC Protected)..." -ForegroundColor Yellow

try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }

    $users = Invoke-RestMethod `
        -Uri "$baseUrl/admin/users" `
        -Method Get `
        -Headers $headers

    Write-Host `
        "Retrieved $($users.Count) registered system users." `
        -ForegroundColor Green
}
catch {
    Write-Host `
        "Admin query failed: $($_.Exception.Message)" `
        -ForegroundColor Red
}

# --------------------------------------------------
# 5. Dashboard Telemetry Query
# --------------------------------------------------

Write-Host "`n[5/5] Testing /api/stats/dashboard..." -ForegroundColor Yellow

try {
    $stats = Invoke-RestMethod `
        -Uri "$baseUrl/stats/dashboard" `
        -Method Get `
        -Headers $headers

    Write-Host `
        "Total Scans: $($stats.totalScans) | Deepfakes Intercepted: $($stats.totalDeepfakes) | Avg Confidence: $($stats.averageConfidence)%" `
        -ForegroundColor Green
}
catch {
    Write-Host `
        "Dashboard query failed: $($_.Exception.Message)" `
        -ForegroundColor Red
}

# --------------------------------------------------
# Completion
# --------------------------------------------------

Write-Host "`n==============================================" -ForegroundColor Cyan
Write-Host "ALL INTEGRATION TESTS COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Cyan