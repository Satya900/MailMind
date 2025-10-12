"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaGoogle, FaKey, FaArrowRight, FaBrain, FaEnvelope, FaSun, FaMoon } from "react-icons/fa";
import ProfilePreview from "../components/ProfilePreview";

export default function Home() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Authentication state variables
  const [userProfile, setUserProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Extract tokens from URL parameters
  const extractTokensFromURL = () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get("access_token");
      const refreshToken = urlParams.get("refresh_token");
      const error = urlParams.get("error");

      // Check for OAuth errors first
      if (error) {
        setAuthError(`Authentication failed: ${error}`);
        return null;
      }

      if (accessToken) {
        return {
          access_token: accessToken,
          refresh_token: refreshToken,
        };
      }
      return null;
    } catch (error) {
      console.error("Error extracting tokens from URL:", error);
      setAuthError("Failed to process authentication response");
      return null;
    }
  };

  // Store tokens in localStorage with correct keys
  const storeTokens = (tokens) => {
    try {
      if (!tokens || typeof tokens !== 'object') {
        throw new Error("Invalid tokens object");
      }

      if (tokens.access_token) {
        localStorage.setItem("gmailAccessToken", tokens.access_token);
      } else {
        throw new Error("Access token is required");
      }

      if (tokens.refresh_token) {
        localStorage.setItem("gmailRefreshToken", tokens.refresh_token);
      }

      // Store timestamp for token management
      localStorage.setItem("gmailTokenTimestamp", Date.now().toString());
    } catch (error) {
      console.error("Error storing tokens:", error);
      setAuthError("Failed to store authentication tokens");
      throw error;
    }
  };

  // Fetch user profile from backend API with retry functionality
  const fetchUserProfile = async (token, retryCount = 0) => {
    const maxRetries = 3;
    const retryDelay = 1000 * Math.pow(2, retryCount); // Exponential backoff: 1s, 2s, 4s

    if (!token) {
      setAuthError("No authentication token available");
      return;
    }

    try {
      setProfileLoading(true);
      setAuthError("");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch("https://server-plum-eight-92.vercel.app/profile/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 401) {
        // Token expired or invalid - clear tokens and prompt re-authentication
        localStorage.removeItem("gmailAccessToken");
        localStorage.removeItem("gmailRefreshToken");
        localStorage.removeItem("gmailTokenTimestamp");
        setAuthError("Authentication expired. Please log in again.");
        setIsAuthenticated(false);
        return;
      }

      if (response.status === 403) {
        setAuthError("Insufficient permissions. Please re-authenticate with required permissions.");
        setIsAuthenticated(false);
        return;
      }

      if (response.status === 429) {
        // Rate limit - retry after delay
        if (retryCount < maxRetries) {
          setAuthError(`Rate limit exceeded. Retrying in ${retryDelay / 1000} seconds...`);
          setTimeout(() => {
            fetchUserProfile(token, retryCount + 1);
          }, retryDelay);
          return;
        } else {
          setAuthError("Rate limit exceeded. Please try again later.");
          setIsAuthenticated(false);
          return;
        }
      }

      if (response.status >= 500 && response.status < 600) {
        // Server error - retry with exponential backoff
        if (retryCount < maxRetries) {
          setAuthError(`Server error. Retrying in ${retryDelay / 1000} seconds... (Attempt ${retryCount + 1}/${maxRetries})`);
          setTimeout(() => {
            fetchUserProfile(token, retryCount + 1);
          }, retryDelay);
          return;
        } else {
          setAuthError("Server is temporarily unavailable. Please try again later.");
          setIsAuthenticated(false);
          return;
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const profileData = await response.json();
      
      // Validate profile data and create fallback for partial data
      if (!profileData) {
        throw new Error("No profile data received");
      }

      // If we don't have email, this is a critical error
      if (!profileData.email) {
        throw new Error("Unable to retrieve email address from profile");
      }

      // Create fallback profile data for missing fields
      const fallbackProfile = {
        id: profileData.id || 'unknown',
        email: profileData.email,
        name: profileData.name || profileData.email.split('@')[0] || 'Gmail User',
        picture: profileData.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || profileData.email)}&background=6b7280&color=ffffff`,
        verified_email: profileData.verified_email || false
      };

      setUserProfile(fallbackProfile);
      setIsAuthenticated(true);

      // Clear URL parameters after successful token extraction
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      
      // Handle different types of errors with retry logic for network errors
      if (error.name === 'AbortError') {
        if (retryCount < maxRetries) {
          setAuthError(`Request timed out. Retrying in ${retryDelay / 1000} seconds... (Attempt ${retryCount + 1}/${maxRetries})`);
          setTimeout(() => {
            fetchUserProfile(token, retryCount + 1);
          }, retryDelay);
          return;
        } else {
          setAuthError("Request timed out. The server may be slow or unavailable. Please try again later.");
        }
      } else if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
        if (retryCount < maxRetries) {
          setAuthError(`Network error. Retrying in ${retryDelay / 1000} seconds... (Attempt ${retryCount + 1}/${maxRetries})`);
          setTimeout(() => {
            fetchUserProfile(token, retryCount + 1);
          }, retryDelay);
          return;
        } else {
          setAuthError("Network error. Please check your internet connection and try again.");
        }
      } else if (error.message.includes('Unable to retrieve email')) {
        setAuthError("Unable to access your Gmail account information. Please check your Google account permissions and try again.");
      } else if (error.message.includes('No profile data received')) {
        setAuthError("No profile data received from Google. Please try again or contact support if the issue persists.");
      } else {
        setAuthError(error.message || "Failed to load profile information. Please try again.");
      }
      
      setIsAuthenticated(false);
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle change account - clear tokens and restart OAuth
  const handleChangeAccount = () => {
    // Clear tokens from localStorage
    localStorage.removeItem("gmailAccessToken");
    localStorage.removeItem("gmailRefreshToken");
    localStorage.removeItem("gmailTokenTimestamp");
    
    // Reset state
    setUserProfile(null);
    setIsAuthenticated(false);
    setAuthError("");
    
    // Restart OAuth flow
    handleGoogleLogin();
  };

  // Manual retry function for profile fetch errors
  const handleRetryProfile = () => {
    const token = localStorage.getItem("gmailAccessToken");
    if (token) {
      setAuthError("");
      fetchUserProfile(token);
    } else {
      setAuthError("No authentication token found. Please log in again.");
    }
  };

  const handleGoogleLogin = () => {
    setAuthLoading(true);
    window.location.href = "https://server-plum-eight-92.vercel.app/auth/google"; // backend auth route
  };

  // Handle token extraction and profile fetching on page load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First, check for tokens in URL parameters (from OAuth callback)
        const tokensFromURL = extractTokensFromURL();

        if (tokensFromURL) {
          try {
            // Store tokens and fetch profile
            storeTokens(tokensFromURL);
            await fetchUserProfile(tokensFromURL.access_token);
          } catch (tokenError) {
            console.error("Error processing OAuth callback tokens:", tokenError);
            setAuthError("Failed to process authentication. Please try logging in again.");
            // Clear potentially corrupted tokens
            localStorage.removeItem("gmailAccessToken");
            localStorage.removeItem("gmailRefreshToken");
            localStorage.removeItem("gmailTokenTimestamp");
          }
        } else {
          // Check for existing tokens in localStorage
          const existingToken = localStorage.getItem("gmailAccessToken");
          if (existingToken) {
            try {
              // Check if token is not too old (optional timestamp check)
              const tokenTimestamp = localStorage.getItem("gmailTokenTimestamp");
              const tokenAge = tokenTimestamp ? Date.now() - parseInt(tokenTimestamp) : 0;
              const maxAge = 24 * 60 * 60 * 1000; // 24 hours

              if (tokenAge > maxAge) {
                // Token is too old, clear it
                localStorage.removeItem("gmailAccessToken");
                localStorage.removeItem("gmailRefreshToken");
                localStorage.removeItem("gmailTokenTimestamp");
                setAuthError("Session expired. Please log in again.");
              } else {
                await fetchUserProfile(existingToken);
              }
            } catch (existingTokenError) {
              console.error("Error with existing token:", existingTokenError);
              // Clear potentially corrupted tokens
              localStorage.removeItem("gmailAccessToken");
              localStorage.removeItem("gmailRefreshToken");
              localStorage.removeItem("gmailTokenTimestamp");
              setAuthError("Stored authentication is invalid. Please log in again.");
            }
          }
        }
      } catch (error) {
        console.error("Error during authentication initialization:", error);
        
        // Handle different types of initialization errors
        if (error.name === 'QuotaExceededError') {
          setAuthError("Browser storage is full. Please clear some data and try again.");
        } else if (error.message && error.message.includes('localStorage')) {
          setAuthError("Browser storage is not available. Please enable cookies and try again.");
        } else {
          setAuthError("Failed to initialize authentication. Please refresh the page and try again.");
        }
      }
    };

    initializeAuth();
  }, []);

  const handleContinue = () => {
    if (!apiKey.trim()) return alert("Enter your OpenRouter API key");
    localStorage.setItem("apiKey", apiKey);
    router.push("/dashboard");
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="relative flex flex-col justify-center items-center min-h-screen px-4 py-12">
        {/* Theme Toggle */}
        <div className="absolute top-6 right-6">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' : 'bg-white hover:bg-gray-100 text-gray-600'} shadow-lg`}
          >
            {isDarkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className={`p-3 ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} rounded-2xl shadow-lg`}>
              <FaBrain className="text-2xl text-white" />
            </div>
            <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              MailMind
            </h1>
          </div>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-lg max-w-md mx-auto leading-relaxed`}>
            Intelligent email management powered by AI. Connect your Gmail and let AI organize your inbox.
          </p>
        </div>

        <div className="w-full max-w-md space-y-6">
          {/* Authentication Section */}
          {!isAuthenticated ? (
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-8 shadow-xl border`}>
              <div className="text-center mb-6">
                <FaEnvelope className={`text-3xl ${isDarkMode ? 'text-blue-400' : 'text-blue-500'} mx-auto mb-3`} />
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Connect Your Gmail</h2>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Securely connect your Gmail account to get started</p>
              </div>
              
              <button
                onClick={handleGoogleLogin}
                disabled={authLoading}
                className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FaGoogle className="text-lg" />
                {authLoading ? "Connecting..." : "Continue with Google"}
              </button>
            </div>
          ) : (
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 shadow-xl border`}>
              <button
                onClick={handleChangeAccount}
                className={`w-full flex items-center justify-center gap-2 border-2 ${isDarkMode ? 'border-gray-600 hover:border-gray-500 text-gray-300 hover:bg-gray-700' : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'} px-4 py-3 rounded-xl transition-all duration-200 font-medium`}
              >
                <FaGoogle />
                Change Account
              </button>
            </div>
          )}

          {/* Error Display */}
          {authError && (
            <div className={`${isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} border-2 rounded-2xl p-6 shadow-lg`}>
              <div className={`${isDarkMode ? 'text-red-300' : 'text-red-700'} text-sm text-center mb-4 font-medium`}>
                {authError}
              </div>
              <div className="flex gap-2 justify-center">
                {/* Show retry button for profile fetch errors when we have a token */}
                {(authError.includes("Network error") || 
                  authError.includes("Failed to load profile") || 
                  authError.includes("Server error") ||
                  authError.includes("Rate limit") ||
                  authError.includes("Server is temporarily unavailable")) && 
                  localStorage.getItem("gmailAccessToken") && (
                  <button
                    onClick={handleRetryProfile}
                    className={`px-4 py-2 text-sm ${isDarkMode ? 'bg-red-800 hover:bg-red-700 border-red-600 text-red-200' : 'bg-red-100 hover:bg-red-200 border-red-300 text-red-700'} border rounded-lg transition-colors font-medium`}
                  >
                    Retry
                  </button>
                )}
                {/* Show login again button for auth errors */}
                {(authError.includes("Authentication expired") || 
                  authError.includes("Authentication failed") ||
                  authError.includes("Access was denied") ||
                  authError.includes("No authorization code") ||
                  authError.includes("Failed to obtain access token")) && (
                  <button
                    onClick={handleGoogleLogin}
                    className={`px-4 py-2 text-sm ${isDarkMode ? 'bg-red-800 hover:bg-red-700 border-red-600 text-red-200' : 'bg-red-100 hover:bg-red-200 border-red-300 text-red-700'} border rounded-lg transition-colors font-medium`}
                  >
                    Login Again
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Profile Preview */}
          {isAuthenticated && (
            <ProfilePreview
              userProfile={userProfile}
              loading={profileLoading}
              error={authError}
              onChangeAccount={handleChangeAccount}
              onRetry={handleRetryProfile}
              isDarkMode={isDarkMode}
            />
          )}

          {/* API Key Section */}
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-8 shadow-xl border`}>
            <div className="text-center mb-6">
              <FaKey className={`text-3xl ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'} mx-auto mb-3`} />
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>API Configuration</h2>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Enter your OpenRouter API key to enable AI features</p>
            </div>
            
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Enter OpenRouter API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className={`w-full px-4 py-3 border-2 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-indigo-400' : 'border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:border-indigo-500'} rounded-xl focus:outline-none transition-colors`}
              />

              <button
                onClick={handleContinue}
                disabled={!apiKey.trim() || !isAuthenticated}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Continue to Dashboard
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm">
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Secure • Private • AI-Powered</p>
        </div>
      </div>
    </div>
  );
}
