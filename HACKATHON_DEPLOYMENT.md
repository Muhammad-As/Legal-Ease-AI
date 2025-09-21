# 🚀 LegalEase AI - Hackathon Deployment Guide

## 🚨 Issues Fixed

### ✅ Model Access Issue
- **Problem**: `gemini-1.5-flash-001` not accessible for new projects after April 29, 2025
- **Solution**: Updated to use `gemini-2.0-flash-001` (latest stable model for new projects)
- **Fallback**: Added `gemini-2.0-flash-lite-001` as backup

### ✅ Security Issue  
- **Problem**: API keys exposed in environment variables and hardcoded paths
- **Solution**: Implemented Application Default Credentials (ADC) for secure authentication

## 🔧 Quick Fix Instructions

### Step 1: Fix Model Configuration ✅ DONE
The code has been updated to use Gemini 2.0 models that work with new Google Cloud projects.

### Step 2: Secure Authentication Setup

**Option A: Application Default Credentials (RECOMMENDED for hackathon)**
```powershell
# Navigate to project
cd C:\Users\ma814\Downloads\legal\legal\backend

# Run the secure setup script
.\setup_credentials.ps1

# Follow the prompts to set up ADC
```

**Option B: Manual Setup**
```powershell
# Set up Google Cloud authentication
gcloud auth application-default login
gcloud config set project legal-ai-472512

# Set environment variables (in PowerShell)
$env:GOOGLE_CLOUD_PROJECT = "legal-ai-472512"
$env:GOOGLE_CLOUD_LOCATION = "us-central1" 
$env:VERTEX_MODEL = "gemini-2.0-flash-001"
$env:LOG_LEVEL = "INFO"

# Remove any hardcoded credential files
Remove-Item Env:GOOGLE_APPLICATION_CREDENTIALS -ErrorAction SilentlyContinue
```

### Step 3: Test the Fix
```powershell
# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Install/update dependencies
pip install -r requirements.txt

# Start server
uvicorn main:app --reload --port 8000

# Test in another terminal
curl http://localhost:8000/health
```

## 🎯 Hackathon Deployment Options

### Option 1: Google Cloud Run (Recommended)
```powershell
# Build and deploy (no secrets in image)
gcloud builds submit backend --tag us-central1-docker.pkg.dev/legal-ai-472512/legal-repo/legal-backend:latest

gcloud run deploy legal-backend `
  --image us-central1-docker.pkg.dev/legal-ai-472512/legal-repo/legal-backend:latest `
  --region us-central1 `
  --allow-unauthenticated `
  --port 8000 `
  --set-env-vars GOOGLE_CLOUD_PROJECT=legal-ai-472512,GOOGLE_CLOUD_LOCATION=us-central1,VERTEX_MODEL=gemini-2.0-flash-001
```

### Option 2: Local Demo (Fastest for hackathon)
```powershell
# Backend
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn main:app --host 0.0.0.0 --port 8000

# Frontend (new terminal)
cd ..\frontend  
npm install
npm run build
npm start
```

## 🔒 Security Best Practices

### ✅ What We Fixed:
1. **No hardcoded credentials** in code
2. **Application Default Credentials** instead of JSON files
3. **Environment-based configuration**
4. **Removed credential file paths** from scripts

### ⚠️ For Production:
1. Use IAM service accounts with minimal permissions
2. Enable VPC and firewall rules
3. Use Cloud Secret Manager for sensitive data
4. Implement proper logging and monitoring

## 🧪 Testing Checklist

Before presenting at hackathon:

- [ ] Health endpoint: `GET /health` returns `{"status": "ok"}`
- [ ] Upload a PDF to `/summarize` - should return summary with Gemini 2.0
- [ ] Upload a PDF to `/risks` - should return risk analysis
- [ ] Upload a PDF + question to `/qa` - should return answer with citations
- [ ] Frontend loads at `http://localhost:3000`
- [ ] All three tabs work (Summarize, Risks, Q&A)

## 🚨 Troubleshooting

### Model Access Error
```json
{"summary": "Error generating content: 404 Publisher Model ... was not found"}
```
**Fix**: Make sure you're using `gemini-2.0-flash-001` (updated in the code)

### Authentication Error
```json
{"detail": "Error generating content: 403 Forbidden"}
```
**Fix**: Run `gcloud auth application-default login`

### Permission Error
```json
{"detail": "Error generating content: Permission denied"}
```
**Fix**: Enable Vertex AI API:
```powershell
gcloud services enable aiplatform.googleapis.com
```

## 🎪 Demo Script for Hackathon

1. **Show the problem**: "Legal documents are complex and hard to understand"
2. **Upload a contract PDF** to each feature:
   - **Summarize**: "Get lawyer bullets + simple explanation"  
   - **Risks**: "See risk levels with visual charts"
   - **Q&A**: "Ask specific questions about clauses"
3. **Highlight AI**: "Powered by Google's latest Gemini 2.0 models"
4. **Show scalability**: "Ready for production with Google Cloud Run"

## 📋 Environment Variables Reference

```bash
# Required
GOOGLE_CLOUD_PROJECT=legal-ai-472512
GOOGLE_CLOUD_LOCATION=us-central1
VERTEX_MODEL=gemini-2.0-flash-001

# Optional
LOG_LEVEL=INFO
MAX_PDF_MB=10
RATE_LIMIT_PER_MIN=60
FRONTEND_ORIGIN=http://localhost:3000
```

---
**🎯 Ready for hackathon! The project now uses Gemini 2.0 models and secure authentication.**