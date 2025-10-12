import { FaSpinner, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export default function ProfilePreview({ 
  userProfile, 
  loading, 
  error, 
  onChangeAccount,
  onRetry,
  isDarkMode = true
}) {
  // Loading state
  if (loading) {
    return (
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 shadow-xl border w-full max-w-md`}>
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full animate-pulse`}></div>
          <div className="flex-1">
            <div className={`h-5 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-lg animate-pulse mb-3`}></div>
            <div className={`h-4 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-lg animate-pulse w-3/4`}></div>
          </div>
        </div>
        <div className="mt-6">
          <div className={`h-10 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-xl animate-pulse`}></div>
        </div>
        <div className={`flex items-center justify-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mt-4`}>
          <FaSpinner className="animate-spin" />
          Loading profile...
        </div>
      </div>
    );
  }

  // Error state with retry functionality
  if (error) {
    return (
      <div className={`${isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} border-2 rounded-2xl p-6 shadow-xl w-full max-w-md`}>
        <div className="flex items-center gap-3 mb-4">
          <FaExclamationTriangle className={`${isDarkMode ? 'text-red-400' : 'text-red-500'} text-xl`} />
          <h3 className={`font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>Profile Error</h3>
        </div>
        <div className={`${isDarkMode ? 'text-red-300' : 'text-red-700'} text-sm mb-6 leading-relaxed`}>
          {error}
        </div>
        <div className="flex gap-3">
          {/* Show retry button for recoverable errors */}
          {(error.includes("Network error") || 
            error.includes("Failed to load profile") || 
            error.includes("Server error") ||
            error.includes("Rate limit") ||
            error.includes("Server is temporarily unavailable")) && onRetry && (
            <button
              onClick={onRetry}
              className={`flex-1 ${isDarkMode ? 'bg-red-800 hover:bg-red-700 border-red-600 text-red-200' : 'bg-red-100 hover:bg-red-200 border-red-300 text-red-700'} border-2 px-4 py-2 rounded-xl transition-colors text-sm font-medium`}
            >
              Retry
            </button>
          )}
          <button
            onClick={onChangeAccount}
            className={`flex-1 ${isDarkMode ? 'bg-red-800 hover:bg-red-700 border-red-600 text-red-200' : 'bg-red-100 hover:bg-red-200 border-red-300 text-red-700'} border-2 px-4 py-2 rounded-xl transition-colors text-sm font-medium`}
          >
            {error.includes("Authentication expired") || error.includes("Insufficient permissions") ? "Login Again" : "Change Account"}
          </button>
        </div>
      </div>
    );
  }

  // Success state with profile data (including fallback for partial data)
  if (userProfile) {
    const hasPartialData = !userProfile.name || userProfile.name === userProfile.email.split('@')[0];
    
    return (
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 shadow-xl border w-full max-w-md`}>
        {/* Show warning for partial data */}
        {hasPartialData && (
          <div className={`${isDarkMode ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} border-2 rounded-xl p-3 mb-4`}>
            <div className={`flex items-center gap-2 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'} text-sm font-medium`}>
              <FaExclamationTriangle className="text-xs" />
              Limited profile information available
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <img
              src={userProfile.picture}
              alt={`${userProfile.name}'s profile picture`}
              className={`w-16 h-16 rounded-full object-cover border-4 ${isDarkMode ? 'border-gray-600' : 'border-white'} shadow-lg`}
              onError={(e) => {
                // Fallback to generated avatar
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name || userProfile.email)}&background=6366f1&color=ffffff&size=64`;
              }}
            />
            {userProfile.verified_email && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <FaCheckCircle className="text-white text-xs" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} text-lg truncate`}>
              {userProfile.name || 'Gmail User'}
            </div>
            <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} truncate`}>
              {userProfile.email}
            </div>
            {userProfile.verified_email && (
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-green-500 font-medium">Verified Account</span>
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={onChangeAccount}
          className={`w-full border-2 ${isDarkMode ? 'border-gray-600 hover:border-gray-500 text-gray-300 hover:bg-gray-700' : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'} px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium`}
        >
          Change Account
        </button>
      </div>
    );
  }

  // Fallback - should not normally render
  return null;
}