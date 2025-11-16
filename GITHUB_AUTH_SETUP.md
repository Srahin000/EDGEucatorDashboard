# GitHub Authentication Setup

## Step 1: Create a Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `MentorOnEdge Dashboard Push`
4. Set expiration (or "No expiration" if you prefer)
5. **Select scopes**: Check the `repo` box (this gives full repository access)
6. Click **"Generate token"** at the bottom
7. **IMPORTANT**: Copy the token immediately - you won't be able to see it again!

## Step 2: Use the Token to Push

When you run `git push`, you'll be prompted:
- **Username**: `Srahin000`
- **Password**: Paste your Personal Access Token (NOT your GitHub password)

## Alternative: Use GitHub Credential Manager

Windows has a credential manager that can store your token:

1. After creating your token, run:
   ```bash
   git push -u origin main
   ```
2. When prompted:
   - Username: `Srahin000`
   - Password: Paste your token
3. Windows will ask if you want to save credentials - click "Yes"

## Verify Access

To verify you have access:
- Visit: https://github.com/Srahin000/EDGEucatorDashboard
- You should see the repository (even if empty)
- Make sure you're logged in as `Srahin000`

