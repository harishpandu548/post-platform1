"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (res.ok) {
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
      });
    } else {
      alert("Signup failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <motion.form
        onSubmit={handleSignup}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white p-8 rounded-2xl shadow-lg w-[360px] space-y-6"
      >
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">
            Create an account
          </h1>
          <p className="text-sm text-gray-500">
            Sign up to get started
          </p>
        </div>

        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />

        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          className="w-full bg-black text-white py-2.5 rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Account"}
        </motion.button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-black font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </motion.form>
    </div>
  );
}
