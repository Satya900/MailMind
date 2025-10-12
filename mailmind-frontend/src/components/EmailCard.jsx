import { FaStar, FaExclamationCircle, FaBullhorn, FaUsers, FaEnvelope, FaTrash } from "react-icons/fa";

export default function EmailCard({ email, onClick, isDarkMode = true }) {
  const categoryConfig = {
    Important: { 
      color: isDarkMode ? "bg-green-900/30 text-green-300 border-green-700" : "bg-green-100 text-green-800 border-green-200", 
      icon: FaStar,
      bgColor: isDarkMode ? "bg-gray-700" : "bg-green-50"
    },
    Promotions: { 
      color: isDarkMode ? "bg-yellow-900/30 text-yellow-300 border-yellow-700" : "bg-yellow-100 text-yellow-800 border-yellow-200", 
      icon: FaBullhorn,
      bgColor: isDarkMode ? "bg-gray-700" : "bg-yellow-50"
    },
    Marketing: { 
      color: isDarkMode ? "bg-orange-900/30 text-orange-300 border-orange-700" : "bg-orange-100 text-orange-800 border-orange-200", 
      icon: FaBullhorn,
      bgColor: isDarkMode ? "bg-gray-700" : "bg-orange-50"
    },
    Spam: { 
      color: isDarkMode ? "bg-red-900/30 text-red-300 border-red-700" : "bg-red-100 text-red-800 border-red-200", 
      icon: FaTrash,
      bgColor: isDarkMode ? "bg-gray-700" : "bg-red-50"
    },
    Social: { 
      color: isDarkMode ? "bg-blue-900/30 text-blue-300 border-blue-700" : "bg-blue-100 text-blue-800 border-blue-200", 
      icon: FaUsers,
      bgColor: isDarkMode ? "bg-gray-700" : "bg-blue-50"
    },
    General: { 
      color: isDarkMode ? "bg-gray-600/30 text-gray-300 border-gray-600" : "bg-gray-100 text-gray-800 border-gray-200", 
      icon: FaEnvelope,
      bgColor: isDarkMode ? "bg-gray-700" : "bg-gray-50"
    },
  };

  const config = categoryConfig[email.category] || categoryConfig.General;
  const IconComponent = config.icon;

  return (
    <div
      onClick={onClick}
      className={`group relative ${config.bgColor || (isDarkMode ? 'bg-gray-700' : 'bg-white')} border ${isDarkMode ? 'border-gray-600 hover:border-gray-500' : 'border-slate-200 hover:border-slate-300'} rounded-xl p-4 hover:shadow-lg ${isDarkMode ? 'hover:shadow-gray-900/50' : 'hover:shadow-slate-200/50'} transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5`}
    >
      {/* Subtle left border accent */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
        email.category === 'Important' ? 'bg-green-500' :
        email.category === 'Promotions' ? 'bg-yellow-500' :
        email.category === 'Marketing' ? 'bg-orange-500' :
        email.category === 'Spam' ? 'bg-red-500' :
        email.category === 'Social' ? 'bg-blue-500' : 
        isDarkMode ? 'bg-gray-500' : 'bg-gray-400'
      } rounded-l-xl`}></div>
      
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold ${isDarkMode ? 'text-gray-100 group-hover:text-white' : 'text-gray-900 group-hover:text-slate-800'} mb-2 line-clamp-2 transition-colors`}>
            {email.subject || "No Subject"}
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2 leading-relaxed`}>
            {email.snippet || "No preview available"}
          </p>
        </div>
        
        {email.category && (
          <div className="flex-shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${config.color} shadow-sm`}>
              <IconComponent className="text-xs" />
              {email.category}
            </span>
          </div>
        )}
      </div>

      {/* Hover effect overlay */}
      <div className={`absolute inset-0 ${isDarkMode ? 'bg-gray-600/10' : 'bg-white/20'} opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl pointer-events-none`}></div>
    </div>
  );
}
