# GitHub Repository Setup Guide

## Step 1: Configure Git (if not already done)

Run these commands with your GitHub username and email:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Or for this repository only:

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## Step 2: Create Initial Commit

The files are already staged. Create the commit:

```bash
git commit -m "Initial commit: MentorOnEdge Dashboard"
```

## Step 3: Create GitHub Repository

### Option A: Using GitHub Website (Recommended)

1. Go to https://github.com/new
2. Repository name: `MentorOnEdgeDashboard` (or your preferred name)
3. Description: "Parent dashboard for MentorOnEdge - AI-powered child mentoring platform"
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### Option B: Using GitHub CLI (if installed)

```bash
gh repo create MentorOnEdgeDashboard --public --source=. --remote=origin --push
```

## Step 4: Connect and Push to GitHub

After creating the repository on GitHub, run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/MentorOnEdgeDashboard.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 5: Verify

Visit your repository on GitHub to verify all files were uploaded successfully.

