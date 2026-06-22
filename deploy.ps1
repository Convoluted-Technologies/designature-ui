# DESIGNATURE Deployment Script
# This script initializes git, commits your changes, and pushes to GitHub.

$REPO_URL = "https://github.com/Godwin-WebDev002/Designature"

Write-Host "Checking for Git..." -ForegroundColor Cyan
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Git is not installed or not in your PATH." -ForegroundColor Red
    Write-Host "Please install Git for Windows: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit
}

Write-Host "Initializing Git repository..." -ForegroundColor Cyan
if (!(Test-Path .git)) {
    git init
    git checkout -b main
}

Write-Host "Adding files..." -ForegroundColor Cyan
git add .

Write-Host "Committing changes..." -ForegroundColor Cyan
git commit -m "Initial commit: Designature Luxury Fashion Landing Page & Supabase Auth"

Write-Host "Adding remote origin..." -ForegroundColor Cyan
if (git remote) {
    git remote set-url origin $REPO_URL
} else {
    git remote add origin $REPO_URL
}

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "Note: You may be prompted to log in to GitHub in a popup window." -ForegroundColor Yellow
git push -u origin main

Write-Host "Deployment Complete!" -ForegroundColor Green
