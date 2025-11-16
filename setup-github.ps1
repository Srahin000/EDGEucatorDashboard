# GitHub Repository Setup Script
# Run this script after configuring your git user name and email

Write-Host "=== GitHub Repository Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if git user is configured
$userName = git config user.name
$userEmail = git config user.email

if (-not $userName -or -not $userEmail) {
    Write-Host "Git user configuration not found!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please run these commands first:" -ForegroundColor Yellow
    Write-Host "  git config --global user.name `"Your Name`"" -ForegroundColor White
    Write-Host "  git config --global user.email `"your.email@example.com`"" -ForegroundColor White
    Write-Host ""
    Write-Host "Or for this repository only:" -ForegroundColor Yellow
    Write-Host "  git config user.name `"Your Name`"" -ForegroundColor White
    Write-Host "  git config user.email `"your.email@example.com`"" -ForegroundColor White
    exit 1
}

Write-Host "Git user: $userName <$userEmail>" -ForegroundColor Green
Write-Host ""

# Check if commit exists
$commitExists = git log -1 --oneline 2>$null
if (-not $commitExists) {
    Write-Host "Creating initial commit..." -ForegroundColor Cyan
    git commit -m "Initial commit: MentorOnEdge Dashboard"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to create commit!" -ForegroundColor Red
        exit 1
    }
    Write-Host "Commit created successfully!" -ForegroundColor Green
} else {
    Write-Host "Commit already exists: $commitExists" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to https://github.com/new" -ForegroundColor Yellow
Write-Host "2. Repository name: MentorOnEdgeDashboard" -ForegroundColor White
Write-Host "3. Choose Public or Private" -ForegroundColor White
Write-Host "4. DO NOT initialize with README, .gitignore, or license" -ForegroundColor White
Write-Host "5. Click 'Create repository'" -ForegroundColor White
Write-Host ""
Write-Host "Then run these commands (replace YOUR_USERNAME):" -ForegroundColor Yellow
Write-Host "  git remote add origin https://github.com/YOUR_USERNAME/MentorOnEdgeDashboard.git" -ForegroundColor White
Write-Host "  git push -u origin main" -ForegroundColor White
Write-Host ""

