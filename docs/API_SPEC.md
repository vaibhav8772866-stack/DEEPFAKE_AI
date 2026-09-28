# Deepfake Sentinel: REST API Specification

Base URL: `http://localhost:8080/api`

---

## 1. Authentication Endpoints

### `POST /api/auth/register`

Registers a new user analyst account.

- **Request Body**:

```json
{
  "username": "analyst_john",
  "email": "john@sentinel.ai",
  "password": "your-secure-password",
  "fullName": "John Doe"
}