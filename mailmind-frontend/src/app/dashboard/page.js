"use client";
import { useState } from "react";
import axios from "axios";
import EmailCard from "@/components/EmailCard";
import {
  FaInbox,
  FaSync,
  FaBrain,
  FaArrowLeft,
  FaExclamationTriangle,
  FaTimes,
  FaEnvelope,
  FaUser,
  FaSpinner,
  FaSun,
  FaMoon,
} from "react-icons/fa";

export default function Dashboard() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [count, setCount] = useState(10);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("gmailAccessToken");
      const res = await axios.post("https://server-plum-eight-92.vercel.app/gmail/fetch", {
        token,
        maxResults: count,
      });
      setEmails(res.data);
    } catch (err) {
      console.error("Error fetching emails:", err);
    } finally {
      setLoading(false);
    }
  };

  const classifyEmails = async () => {
    setLoading(true);
    try {
      const apiKey = localStorage.getItem("apiKey");
      const res = await axios.post("https://server-plum-eight-92.vercel.app/classify", {
        apiKey,
        emails,
      });
      setEmails(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openEmail = async (id) => {
    if (!id || id === "undefined") {
      setSelectedEmail({
        error: true,
        message: "Invalid email ID. Please try refreshing the email list.",
      });
      return;
    }

    setDetailLoading(true);
    try {
      const token = localStorage.getItem("gmailAccessToken");

      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const res = await axios.get(`https://server-plum-eight-92.vercel.app/gmail/message/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedEmail(res.data);
    } catch (err) {
      console.error("Error fetching email details:", err);

      // Show user-friendly error message
      let errorMessage = "Failed to load email details";

      if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const data = err.response.data;

        if (status === 401) {
          errorMessage =
            "Authentication expired. Please refresh the page and log in again.";
        } else if (status === 403) {
          errorMessage = "Insufficient permissions to access this email.";
        } else if (status === 404) {
          errorMessage = "Email not found or has been deleted.";
        } else {
          errorMessage = data?.message || `Server error (${status})`;
        }
      } else if (err.request) {
        // Network error
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else {
        errorMessage = err.message;
      }

      // Set error state to show in UI
      setSelectedEmail({
        error: true,
        message: errorMessage,
      });
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div
      className={`relative flex h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Left panel — inbox */}
      <div
        className={`w-1/2 border-r ${
          isDarkMode
            ? "border-gray-700 bg-gray-800"
            : "border-gray-200 bg-white"
        } shadow-sm overflow-hidden`}
      >
        {/* Header */}
        <div
          className={`${
            isDarkMode ? "bg-gray-800 border-b border-gray-700" : "bg-blue-600"
          } text-white p-6 shadow-lg`}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <FaInbox className="text-2xl" />
              <div>
                <h2 className="text-2xl font-bold">MailMind</h2>
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-blue-100"
                  } text-sm`}
                >
                  Intelligent Email Management
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-yellow-400"
                    : "bg-white/20 hover:bg-white/30 text-white"
                }`}
              >
                {isDarkMode ? (
                  <FaSun className="text-lg" />
                ) : (
                  <FaMoon className="text-lg" />
                )}
              </button>

              <div
                className={`flex items-center gap-2 ${
                  isDarkMode ? "bg-gray-700" : "bg-white/20"
                } rounded-lg px-3 py-2`}
              >
                <FaEnvelope className="text-sm" />
                <select
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className={`bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer ${
                    isDarkMode ? "text-gray-200" : "text-white"
                  }`}
                >
                  {[5, 10, 15, 20].map((n) => (
                    <option key={n} value={n} className="text-gray-800">
                      {n} emails
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchEmails}
              disabled={loading}
              className={`flex items-center gap-2 ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-white/20 hover:bg-white/30"
              } disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-all duration-200 font-medium`}
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaSync />}
              {loading ? "Fetching..." : "Fetch Emails"}
            </button>
            <button
              onClick={classifyEmails}
              disabled={loading || emails.length === 0}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-lg"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaBrain />}
              {loading ? "Classifying..." : "AI Classify"}
            </button>
          </div>
        </div>

        {/* Email List */}
        <div className="p-6 overflow-y-auto h-full">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <FaSpinner
                  className={`animate-spin text-3xl ${
                    isDarkMode ? "text-blue-400" : "text-blue-500"
                  } mx-auto mb-4`}
                />
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } font-medium`}
                >
                  Loading your emails...
                </p>
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-400"
                  } text-sm`}
                >
                  This may take a few moments
                </p>
              </div>
            </div>
          )}

          {!loading && emails.length === 0 && (
            <div className="text-center py-12">
              <FaInbox
                className={`text-6xl ${
                  isDarkMode ? "text-gray-600" : "text-gray-300"
                } mx-auto mb-4`}
              />
              <h3
                className={`text-xl font-semibold ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } mb-2`}
              >
                No emails loaded
              </h3>
              <p
                className={`${
                  isDarkMode ? "text-gray-400" : "text-gray-400"
                } mb-6`}
              >
                Click "Fetch Emails" to load your Gmail messages
              </p>
            </div>
          )}

          <div className="space-y-3">
            {emails.map((mail, index) => (
              <EmailCard
                key={mail.id || `email-${index}`}
                email={mail}
                onClick={() => openEmail(mail.id)}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — detail */}
      <div
        className={`absolute top-0 right-0 w-1/2 h-full ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } shadow-2xl transform transition-all duration-300 ease-in-out ${
          selectedEmail ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {detailLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FaSpinner
                className={`animate-spin text-4xl ${
                  isDarkMode ? "text-blue-400" : "text-blue-500"
                } mx-auto mb-4`}
              />
              <p
                className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } font-medium`}
              >
                Loading email content...
              </p>
            </div>
          </div>
        ) : selectedEmail ? (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div
              className={`${
                isDarkMode
                  ? "bg-gray-900 border-b border-gray-700"
                  : "bg-slate-800"
              } text-white p-6 shadow-lg`}
            >
              <button
                className={`flex items-center gap-2 ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-white/20 hover:bg-white/30"
                } px-4 py-2 rounded-lg transition-all duration-200 mb-4 text-sm font-medium`}
                onClick={() => setSelectedEmail(null)}
              >
                <FaArrowLeft />
                Back to Inbox
              </button>

              {selectedEmail.error ? (
                <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <FaExclamationTriangle className="text-red-300 text-xl" />
                    <h3 className="text-red-100 font-semibold text-lg">
                      Error Loading Email
                    </h3>
                  </div>
                  <p className="text-red-200 mb-4">{selectedEmail.message}</p>
                  <button
                    onClick={() => setSelectedEmail(null)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <FaTimes />
                    Close
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold mb-2 leading-tight">
                    {selectedEmail.subject || "No Subject"}
                  </h2>
                  <div
                    className={`flex items-center gap-2 ${
                      isDarkMode ? "text-gray-300" : "text-slate-300"
                    }`}
                  >
                    <FaUser className="text-sm" />
                    <span className="text-sm">
                      From: {selectedEmail.from || "Unknown Sender"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            {!selectedEmail.error && (
              <div className="flex-1 overflow-y-auto p-6">
                <div
                  className={`${
                    isDarkMode ? "bg-gray-700" : "bg-slate-50"
                  } rounded-lg p-6 shadow-inner`}
                >
                  <div
                    className={`prose max-w-none ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    } leading-relaxed`}
                    dangerouslySetInnerHTML={{
                      __html:
                        selectedEmail.body ||
                        `<p class='${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        } italic'>No content available</p>`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FaEnvelope
                className={`text-6xl ${
                  isDarkMode ? "text-gray-600" : "text-gray-300"
                } mx-auto mb-4`}
              />
              <h3
                className={`text-xl font-semibold ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } mb-2`}
              >
                Select an email
              </h3>
              <p
                className={`${isDarkMode ? "text-gray-400" : "text-gray-400"}`}
              >
                Choose an email from the inbox to view its content
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
