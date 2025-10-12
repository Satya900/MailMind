# MailMind Deployment Guide

## 🚀 Quick Deployment Summary

### Current Status:

- ✅ **Backend**: Deployed at `https://server-plum-eight-92.vercel.app`
- ✅ **Frontend Code**: Updated to use production backend URLs
- ⏳ **Frontend Deployment**: Ready to deploy to Vercel

## 📤 Deploy to GitHub + Vercel

### 1. Push to GitHub Repository

```bash
# From project root directory
git init
git add .
git commit -m "MailMind: Intelligent Email Management - Complete Project"

# Replace with your GitHub repository URL
git remote add origin https://github.com/yourusername/mailmind.git
git branch -M main
git push -u origin main
```

### 2. Deploy Frontend to Vercel

#### Option A: Vercel Dashboard (Recommended)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. **Import** your GitHub repository
4. **Important**: Set **Root Directory** to `mailmind-frontend`
5. Click **"Deploy"**

#### Option B: Vercel CLI

```bash
cd mailmind-frontend
npx vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: mailmind-frontend
# - Directory: ./mailmind-frontend
```

### 3. Update Google OAuth (CRITICAL)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your **OAuth 2.0 Client ID**
4. Add to **Authorized redirect URIs**:
   ```
   https://server-plum-eight-92.vercel.app/auth/google/callback
   ```

### 4. Test Your Deployment

- Visit your deployed frontend URL
- Test Google authentication
- Test email fetching
- Test AI classification

## 🔧 Project Structure for Deployment

```
MailMind/ (GitHub Repository)
├── mailmind-frontend/     # Frontend → Deploy to Vercel
│   ├── src/
│   ├── package.json
│   └── vercel.json       # Frontend Vercel config
├── Server/               # Backend → Already deployed
│   ├── routes/
│   ├── index.js
│   └── vercel.json       # Backend Vercel config
├── README.md
├── DEPLOYMENT.md
└── .gitignore
```

## 🎯 Key Points

1. **Monorepo Setup**: Both frontend and backend in one repository
2. **Separate Deployments**: Backend and frontend deployed as separate Vercel projects
3. **Root Directory**: Set `mailmind-frontend` as root directory for frontend deployment
4. **OAuth Configuration**: Must update Google OAuth redirect URI
5. **Environment Variables**: Backend already has required environment variables

## 🚨 Important Notes

- **Backend is already deployed** - no need to redeploy
- **Frontend code is updated** - all API calls point to production backend
- **OAuth redirect URI** - must be updated in Google Cloud Console
- **Root directory** - crucial for Vercel to find the frontend code

## ✅ Success Indicators

After deployment, you should be able to:

- ✅ Visit your frontend URL
- ✅ Click "Continue with Google" and authenticate
- ✅ See your Gmail profile information
- ✅ Fetch emails from Gmail
- ✅ Use AI to classify emails
- ✅ View email details

---

**Ready to deploy!** 🚀
