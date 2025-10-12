"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function EmailDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchEmail = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("gmailAccessToken");
        const res = await axios.get(
          `https://server-plum-eight-92.vercel.app/gmail/message/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEmail(res.data);
      } catch (err) {
        console.error("Error fetching email:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmail();
  }, [id]);

  if (loading) return <p className="p-6">Loading email...</p>;
  if (!email) return <p className="p-6">No email found.</p>;

  const colors = {
    Important: "text-green-700 border-green-500",
    Promotions: "text-yellow-600 border-yellow-500",
    Marketing: "text-orange-500 border-orange-400",
    Spam: "text-red-600 border-red-400",
    Social: "text-blue-500 border-blue-400",
    General: "text-gray-500 border-gray-400",
  };

  return (
    <div className="grid grid-cols-2 h-screen">
      {/* Left panel */}
      <div className="border-r p-6 overflow-y-auto">
        <button
          className="border px-3 py-1 rounded mb-4 text-sm hover:bg-gray-100"
          onClick={() => router.push("/dashboard")}
        >
          ← Back
        </button>

        <h2 className="text-xl font-semibold mb-2">{email.subject}</h2>
        {email.category && (
          <span
            className={`text-sm border px-2 py-1 rounded ${colors[email.category]}`}
          >
            {email.category}
          </span>
        )}
        <p className="mt-4 text-gray-700 whitespace-pre-line">
          {email.snippet || "No preview available"}
        </p>
      </div>

      {/* Right panel */}
      <div className="p-6 overflow-y-auto bg-gray-50">
        <h2 className="text-lg font-semibold">{email.subject}</h2>
        {email.from && (
          <p className="text-sm text-gray-500 mb-2">From: {email.from}</p>
        )}
        <div
          className="prose text-sm text-gray-800"
          dangerouslySetInnerHTML={{ __html: email.body || "No body content" }}
        />
      </div>
    </div>
  );
}
