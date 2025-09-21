# LegalEase AI - Secure Credential Setup for Local Development
# This script helps set up credentials securely without exposing them in code

Write-Host "🔐 LegalEase AI Credential Setup" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Check if Google Cloud SDK is installed
try {
    $gcloudVersion = gcloud version --format="value(Google Cloud SDK)" 2>$null
    Write-Host "✅ Google Cloud SDK detected: $gcloudVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Google Cloud SDK not found. Please install it first:" -ForegroundColor Red
    Write-Host "   https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

# Method 1: Application Default Credentials (RECOMMENDED)
Write-Host "`n🚀 Method 1: Application Default Credentials (Recommended)" -ForegroundColor Cyan
Write-Host "This method doesn't require storing JSON files on your machine." -ForegroundColor Gray

$useADC = Read-Host "Use Application Default Credentials? (y/n)"
if ($useADC -eq 'y' -or $useADC -eq 'Y') {
    Write-Host "Setting up Application Default Credentials..." -ForegroundColor Yellow
    
    # Set project first
    $env:GOOGLE_CLOUD_PROJECT = "legal-ai-472512"
    gcloud config set project legal-ai-472512
    
    # Login and set ADC
    gcloud auth application-default login
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Application Default Credentials configured successfully!" -ForegroundColor Green
        
        # Clear any existing credential file env var
        Remove-Item Env:GOOGLE_APPLICATION_CREDENTIALS -ErrorAction SilentlyContinue
        
        # Set required environment variables
        $env:GOOGLE_CLOUD_PROJECT = "legal-ai-472512"
        $env:GOOGLE_CLOUD_LOCATION = "us-central1"
        $env:VERTEX_MODEL = "gemini-2.0-flash-001"
        $env:LOG_LEVEL = "INFO"
        
        Write-Host "✅ Environment configured for hackathon deployment!" -ForegroundColor Green
        Write-Host "You can now run: uvicorn main:app --reload --port 8000" -ForegroundColor Green
        
    } else {
        Write-Host "❌ Failed to set up Application Default Credentials" -ForegroundColor Red
        exit 1
    }
} else {
    # Method 2: Service Account Key (if absolutely necessary)
    Write-Host "`n⚠️  Method 2: Service Account Key File" -ForegroundColor Yellow
    Write-Host "Only use this if ADC doesn't work. NEVER commit this file to git!" -ForegroundColor Red
    
    $keyPath = Read-Host "Enter the full path to your service account JSON file"
    
    if (Test-Path $keyPath) {
        Write-Host "✅ Key file found" -ForegroundColor Green
        
        # Set environment variables
        $env:GOOGLE_APPLICATION_CREDENTIALS = $keyPath
        $env:GOOGLE_CLOUD_PROJECT = "legal-ai-472512"
        $env:GOOGLE_CLOUD_LOCATION = "us-central1"
        $env:VERTEX_MODEL = "gemini-2.0-flash-001"
        $env:LOG_LEVEL = "INFO"
        
        Write-Host "✅ Environment configured!" -ForegroundColor Green
        Write-Host "⚠️  Remember: NEVER commit the JSON file to version control!" -ForegroundColor Red
        
    } else {
        Write-Host "❌ Key file not found at: $keyPath" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Navigate to backend: cd C:\Users\ma814\Downloads\legal\legal\backend" -ForegroundColor White
Write-Host "2. Activate virtual environment: .\.venv\Scripts\Activate.ps1" -ForegroundColor White
Write-Host "3. Start server: uvicorn main:app --reload --port 8000" -ForegroundColor White
Write-Host "4. Test at: http://localhost:8000/health" -ForegroundColor White

Write-Host "`n✨ For hackathon deployment, use Application Default Credentials!" -ForegroundColor Green