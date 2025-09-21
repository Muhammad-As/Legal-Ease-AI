<<<<<<< HEAD
# LegalEase AI Prototype (Upgraded)

LegalEase AI helps you quickly understand legal documents by generating concise summaries, flagging risky clauses, and enabling interactive Q&A.

Highlights of this upgrade
- Production-friendlier API contracts with typed responses (FastAPI + Pydantic)
- Robust JSON parsing for risk extraction and consistent errors
- Chunked summarization to handle long PDFs
- Cleaner CORS/env configuration with .env examples
- Polished Next.js UI: reusable components, better feedback, copy/download, history
- Repository hygiene (.gitignore, env docs)

## Folder Structure
```
legal-ai-prototype/
│── backend/          # FastAPI + Vertex AI backend
│── frontend/         # Next.js + Tailwind frontend
│── docs/             # Presentation assets / demo notes
```

## Prerequisites
- Python 3.10+
- Node.js 18+
- A Google Cloud project with Vertex AI enabled

## Backend Setup (Vertex AI)
```powershell
# In Windows PowerShell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Local auth (use your downloaded JSON ONLY locally; do not commit it)
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\Users\dheer\Downloads\legal-ai-472512-d752ffb9cf3b.json"
$env:GOOGLE_CLOUD_PROJECT = "legal-ai-472512"
$env:GOOGLE_CLOUD_LOCATION = "us-central1"
$env:VERTEX_MODEL = "gemini-1.5-flash-001"
$env:FRONTEND_ORIGIN = "http://localhost:3000"
$env:CORS_ORIGINS = "http://localhost:3000,http://127.0.0.1:3000"
uvicorn main:app --reload --port 8000
```

Or copy `backend/.env.example` to `backend/.env` and fill it. For local dev without a key file, you can also run:
```powershell
# Use gcloud Application Default Credentials instead of a JSON file
# (No secret file needed; recommended.)
gcloud auth application-default login
$env:GOOGLE_CLOUD_PROJECT = "legal-ai-472512"
$env:GOOGLE_CLOUD_LOCATION = "us-central1"
uvicorn main:app --reload --port 8000
```

### API Endpoints
- GET `/health` – Health check
- POST `/summarize` – Form file field `file` (PDF). Returns `{ summary }`. Uses chunked summarization for big docs.
- POST `/risks` – Form file field `file` (PDF). Returns `{ risks: [{ clause, risk_level, reason }] }`. Robust JSON extraction + validation.
- POST `/qa` – Form fields: `file` (PDF) and `question` (string). Returns `{ answer }`.

## Frontend Setup
```powershell
cd frontend
npm install
# Optional for non-default backend URL
$env:NEXT_PUBLIC_API_BASE = "http://localhost:8000"
npm run dev      # http://localhost:3000
```

Or copy `frontend/.env.local.example` to `frontend/.env.local` and adjust.

## Usage
1. Open `http://localhost:3000`.
2. Pick a feature tab:
   - Summarize – upload a PDF to get concise bullets and ELI15.
   - Risks – view a risk distribution chart plus details.
   - Q&A – ask questions and keep a session history.

## Production Notes
- CORS: Set `FRONTEND_ORIGIN` (and optional `CORS_ORIGINS`) to your deployed frontend host(s).
- Secrets: Use environment variables in your platform’s secret manager; do not commit them.
- Large docs: The backend chunks input text to stay within model limits.
- PDF extraction: PyPDF2 may return no text for scanned PDFs; enable OCR with `OCR_ENABLED=true` and install Tesseract + `pdf2image`, `pytesseract`.
- Metrics: A Prometheus `/metrics` endpoint is exposed when running the backend.
- Limits & rate limiting: `MAX_PDF_MB` to cap uploads; `RATE_LIMIT_PER_MIN` to throttle per-IP.

## Development Tips
- Visit `http://localhost:8000/docs` for interactive API testing.
- Common curl examples:
  - `curl -F "file=@contract.pdf" http://localhost:8000/summarize`
  - `curl -F "file=@contract.pdf" http://localhost:8000/risks`
  - `curl -F "file=@contract.pdf" -F "question=What is the termination clause?" http://localhost:8000/qa`

## Deploy to Cloud Run (no keys in image)
- Enable services (once):
  ```powershell
  gcloud auth login
  gcloud config set project legal-ai-472512
  gcloud services enable aiplatform.googleapis.com run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com
  gcloud artifacts repositories create legal-repo --repository-format=docker --location=us-central1
  ```
- Build and deploy:
  ```powershell
  gcloud builds submit backend --tag us-central1-docker.pkg.dev/legal-ai-472512/legal-repo/legal-backend:latest
  gcloud run deploy legal-backend `
    --image us-central1-docker.pkg.dev/legal-ai-472512/legal-repo/legal-backend:latest `
    --region us-central1 `
    --allow-unauthenticated `
    --port 8000 `
--set-env-vars GOOGLE_CLOUD_PROJECT=legal-ai-472512,GOOGLE_CLOUD_LOCATION=us-central1,VERTEX_MODEL=gemini-1.5-flash-001,FRONTEND_ORIGIN=http://localhost:3000,CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,MAX_PDF_MB=10,RATE_LIMIT_PER_MIN=60,LOG_LEVEL=INFO
  ```
- Security: Attach a service account with roles/aiplatform.user using `--service-account` if needed. Do not provide JSON keys to Cloud Run; the service account identity handles auth.

## License
Prototype for demonstration purposes only.
=======
# Legal-Ease-AI
>>>>>>> origin/main
