"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function AdminPage() {
  const { data: session } = useSession();
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handlePromote() {
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/promote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage("You are now an ADMIN. Please re-login.");
    } else {
      setMessage(data.error || "Failed");
    }
  }

  if (!session) {
    return <p className="p-6">Please login first.</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow w-96 space-y-4">
        <h1 className="text-xl font-bold text-center">
          Admin Access
        </h1>

        <input
          type="password"
          placeholder="Enter admin secret"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        <button
          onClick={handlePromote}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Verifying..." : "Become Admin"}
        </button>

        {message && (
          <p className="text-center text-sm text-gray-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
