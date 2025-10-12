# MailMind 🧠📧

**Intelligent Email Management Powered by AI**

MailMind is a modern web application that connects to your Gmail account and uses AI to automatically classify and organize your emails. Built with Next.js and Express.js, it provides a beautiful, responsive interface with dark mode support for efficient email management.

🚀 **Backend Deployed**: [https://server-plum-eight-92.vercel.app](https://server-plum-eight-92.vercel.app)

![MailMind Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)

## ✨ Features

### 🔐 **Secure Gmail Integration**

- OAuth 2.0 authentication with Google
- Secure token management and refresh
- Read-only Gmail access with proper scopes
- Profile information retrieval

### 🤖 **AI-Powered Email Classification**

- Automatic email categorization using OpenRouter API
- Categories: Important, Promotions, Marketing, Social, Spam, General
- Intelligent content analysis of subject lines and snippets
- Preserves original email data while adding AI insights

### 🎨 **Modern User Interface**

- **Dark Mode by Default** with light mode toggle
- Responsive design for desktop and mobile
- Beautiful email cards with category badges
- Smooth animations and transitions
- Professional gradient-free design with solid colors

### 📧 **Email Management**

- Fetch emails from Gmail with customizable count (5, 10, 15, 20)
- Full email content viewing with HTML support
- Email search and filtering by categories
- Detailed email view with sender information

### 🛡️ **Robust Error Handling**

- Comprehensive error messages for all scenarios
- Automatic retry functionality for network errors
- Graceful handling of authentication failures
- User-friendly error recovery options

## 🏗️ Architecture

### Project Structure

```
MailMind/
├── mailmind-frontend/         # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/     # Email dashboard page
│   │   │   │   └── page.js    # Dashboard component
│   │   │   ├── page.js        # Home/authentication page
│   │   │   ├── layout.js      # App layout and metadata
│   │   │   └── globals.css    # Global Tailwind styles
│   │   └── components/
│   │       ├── EmailCard.jsx  # Email list item component
│   │       └── ProfilePreview.jsx # User profile display
│   ├── public/                # Static assets
│   ├── package.json           # Frontend dependencies
│   ├── next.config.mjs        # Next.js configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   └── postcss.config.mjs     # PostCSS configuration
├── Server/                    # Express.js Backend
│   ├── routes/
│   │   ├── auth.routes.js     # Google OAuth authentication
│   │   ├── gmail.routes.js    # Gmail API integration
│   │   ├── profile.routes.js  # User profile management
│   │   └── classify.routes.js # AI email classification
│   ├── index.js               # Server entry point
│   ├── package.json           # Backend dependencies
│   ├── vercel.json            # Vercel deployment config
│   ├── .env                   # Environment variables (not in repo)
│   └── .gitignore             # Git ignore rules
└── README.md                  # Project documentation
```

### Technology Stack

#### Frontend

- **Framework**: Next.js 15.5.4 with React 19.1.0
- **Styling**: Tailwind CSS 4.0 with PostCSS
- **Icons**: React Icons 5.5.0
- **HTTP Client**: Axios (for API calls)
- **Development**: Turbopack for fast builds

#### Backend

- **Runtime**: Node.js with Express.js 5.1.0
- **Authentication**: Google OAuth 2.0 via googleapis
- **AI Integration**: OpenAI SDK with OpenRouter
- **Utilities**: CORS, dotenv for configuration
- **Deployment**: Vercel with serverless functions

#### External Services

- **Gmail API**: Email fetching and management
- **Google OAuth**: Secure authentication
- **OpenRouter**: AI-powered email classification
- **Vercel**: Serverless deployment platform

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google Cloud Console project with Gmail API enabled
- OpenRouter API key for AI classification

### 1. Clone the Repository

```bash
git clone <repository-url>
cd MailMind
```

### 2. Backend Setup

```bash
cd Server
npm install

# Create .env file
cp .env.example .env
```

Configure your `.env` file:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
PORT=5000
```

Start the backend server:

```bash
npm start
```

### 3. Frontend Setup

```bash
cd mailmind-frontend
npm install
npm run dev
```

### 4. Google Cloud Console Setup

1. **Create a Google Cloud Project**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Gmail API**

   - Navigate to "APIs & Services" > "Library"
   - Search for "Gmail API" and enable it

3. **Create OAuth 2.0 Credentials**

   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Authorized redirect URIs: `http://localhost:5000/auth/google/callback`

4. **Configure OAuth Consent Screen**
   - Add your email as a test user
   - Add required scopes:
     - `openid`
     - `email`
     - `profile`
     - `https://www.googleapis.com/auth/gmail.readonly`
     - `https://www.googleapis.com/auth/userinfo.profile`
     - `https://www.googleapis.com/auth/userinfo.email`

### 5. Get OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/)
2. Create an account and generate an API key
3. Enter the API key in the MailMind application

## 🔧 Configuration

### Environment Variables

**Server (.env)**

```env
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
PORT=5000
```

### OAuth Scopes

The application requests the following Google OAuth scopes:

- `openid` - Basic OpenID Connect
- `email` - User's email address
- `profile` - Basic profile information
- `https://www.googleapis.com/auth/gmail.readonly` - Read-only Gmail access
- `https://www.googleapis.com/auth/userinfo.profile` - User profile data
- `https://www.googleapis.com/auth/userinfo.email` - User email data

## 📱 Usage

### 1. **Authentication**

- Visit `http://localhost:3000`
- Click "Continue with Google"
- Grant required permissions
- Your profile will be displayed upon successful authentication

### 2. **Email Management**

- Navigate to the dashboard
- Click "Fetch Emails" to load your Gmail messages
- Select email count (5, 10, 15, or 20 emails)
- Click on any email to view full content

### 3. **AI Classification**

- Enter your OpenRouter API key
- Click "AI Classify" to categorize your emails
- Emails will be automatically sorted into categories:
  - 🌟 **Important** - Critical emails requiring attention
  - 📢 **Promotions** - Promotional offers and deals
  - 🎯 **Marketing** - Marketing campaigns and newsletters
  - 👥 **Social** - Social media notifications
  - 🗑️ **Spam** - Unwanted or suspicious emails
  - 📧 **General** - Regular correspondence

### 4. **Theme Toggle**

- Click the sun/moon icon to switch between dark and light modes
- Dark mode is enabled by default
- Theme preference is maintained during the session

## 🛠️ API Endpoints

### Authentication

- `GET /auth/google` - Initiate Google OAuth flow
- `GET /auth/google/callback` - Handle OAuth callback

### Gmail Integration

- `POST /gmail/fetch` - Fetch emails from Gmail
- `GET /gmail/message/:id` - Get specific email content

### User Profile

- `GET /profile/me` - Get authenticated user profile

### AI Classification

- `POST /classify` - Classify emails using AI

## 🎨 UI Components

### EmailCard

- Displays email subject, snippet, and category
- Color-coded category badges with icons
- Hover effects and smooth transitions
- Dark/light mode support

### ProfilePreview

- Shows user profile information
- Verification status indicator
- Account switching functionality
- Error handling with retry options

### Dashboard

- Split-pane layout with email list and detail view
- Responsive design for different screen sizes
- Loading states and empty state illustrations
- Theme toggle integration

## 🔒 Security Features

- **OAuth 2.0** - Industry-standard authentication
- **Read-only Access** - No email modification permissions
- **Token Encryption** - Secure token storage and transmission
- **CORS Protection** - Cross-origin request security
- **Input Validation** - Server-side request validation
- **Error Sanitization** - Safe error message handling

## 🚀 Deployment

### Repository Setup

#### 1. Push to GitHub:
```bash
# Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial commit: MailMind - Intelligent Email Management"

# Add your GitHub repository
git remote add origin https://github.com/yourusername/mailmind.git
git branch -M main
git push -u origin main
```

### Backend Deployment (Already Done ✅)

The backend is already deployed at: `https://server-plum-eight-92.vercel.app`

### Frontend Deployment (Vercel)

#### Option 1: Deploy via Vercel Dashboard (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. **Important**: Set the root directory to `mailmind-frontend`
5. Vercel will auto-detect Next.js and configure build settings
6. Click "Deploy"

#### Option 2: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend (from project root)
cd mailmind-frontend
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: mailmind-frontend
# - Directory: ./mailmind-frontend (or current directory)
```

#### Frontend Vercel Configuration
The frontend includes `mailmind-frontend/vercel.json`:
```json
{
  "name": "mailmind-frontend",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ]
}
```

### Build for static hosting:

```bash
cd mailmind-frontend
npm run build
npm start
```

### Production Configuration

#### 1. Update OAuth Redirect URIs

In Google Cloud Console, add your production URLs:

- `https://server-plum-eight-92.vercel.app/auth/google/callback`

#### 2. Frontend API Endpoints (Already Updated)

The frontend has been configured to use the deployed backend:

```javascript
// All API calls now point to the deployed Vercel backend
const API_BASE_URL = "https://server-plum-eight-92.vercel.app";
```

#### 3. CORS Configuration

The backend is already configured with CORS enabled for all origins. For production, consider restricting to specific domains:

```javascript
app.use(
  cors({
    origin: ["https://your-frontend-domain.vercel.app"],
  })
);
```

### Complete Deployment Guide

#### Step-by-Step Deployment Process:

1. **✅ Backend Already Deployed**
   - Backend URL: `https://server-plum-eight-92.vercel.app`
   - Environment variables configured
   - API endpoints working

2. **📤 Push to GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "MailMind: Complete project with frontend and backend"
   git remote add origin https://github.com/yourusername/mailmind.git
   git push -u origin main
   ```

3. **🚀 Deploy Frontend to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project" → Import from GitHub
   - Select your MailMind repository
   - **Set Root Directory**: `mailmind-frontend`
   - Deploy (Vercel auto-detects Next.js)

4. **🔧 Update Google OAuth Settings**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to APIs & Services → Credentials
   - Edit OAuth 2.0 Client ID
   - Add redirect URI: `https://server-plum-eight-92.vercel.app/auth/google/callback`

5. **✅ Test Complete Flow**
   - Visit your deployed frontend URL
   - Test Google authentication
   - Test email fetching and AI classification

### Deployment Checklist

- [x] ✅ Backend deployed to Vercel with environment variables
- [x] ✅ Frontend code updated with production API endpoints
- [ ] 📤 Code pushed to GitHub repository
- [ ] 🚀 Frontend deployed to Vercel from GitHub
- [ ] 🔧 Google OAuth redirect URIs updated for production
- [ ] ✅ Test authentication flow in production
- [ ] ✅ Test email fetching and AI classification
- [ ] ✅ Verify CORS configuration

## 🧪 Testing

### Manual Testing Checklist

- [ ] Google OAuth authentication flow
- [ ] Email fetching with different counts
- [ ] Email detail view functionality
- [ ] AI classification with various email types
- [ ] Theme switching (dark/light mode)
- [ ] Error handling scenarios
- [ ] Responsive design on different devices

## 🔧 Troubleshooting

### Common Issues

#### 1. **403 Forbidden Error when fetching emails**

**Problem**: Access token doesn't have Gmail permissions
**Solution**:

- Clear browser localStorage (gmailAccessToken, gmailRefreshToken)
- Re-authenticate to get new token with Gmail scopes
- Verify OAuth scopes include `https://www.googleapis.com/auth/gmail.readonly`

#### 2. **OAuth Redirect URI Mismatch**

**Problem**: Google OAuth callback fails
**Solution**:

- Ensure redirect URI in Google Cloud Console matches exactly: `http://localhost:5000/auth/google/callback`
- For production, update to your deployed backend URL

#### 3. **AI Classification Not Working**

**Problem**: OpenRouter API key issues
**Solution**:

- Verify OpenRouter API key is valid and has credits
- Check network connectivity to OpenRouter API
- Ensure emails are fetched before attempting classification

#### 4. **CORS Errors**

**Problem**: Frontend can't connect to backend
**Solution**:

- Ensure backend is running on port 5000
- Check CORS configuration in `Server/index.js`
- Verify frontend is making requests to correct backend URL

#### 5. **Environment Variables Not Loading**

**Problem**: Google OAuth credentials not found
**Solution**:

- Ensure `.env` file exists in `Server/` directory
- Verify environment variable names match exactly
- Restart server after changing environment variables

### Debug Mode

Enable detailed logging by adding to your `.env`:

```env
NODE_ENV=development
DEBUG=true
```

### Logs to Check

- **Browser Console**: Frontend errors and network requests
- **Server Console**: Backend API errors and OAuth flow
- **Network Tab**: HTTP request/response details
- **Application Tab**: localStorage token storage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gmail API** - Email integration
- **OpenRouter** - AI classification services
- **Next.js** - React framework
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Beautiful icon library

## 📞 Support

For support, email [your-email@example.com] or create an issue in the repository.

---

**Built with ❤️ by [Your Name]**

_MailMind - Making email management intelligent and effortless_
