"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold">
          Post<span className="text-gray-500">Platform</span>
        </Link>

        <div className="flex items-center gap-4">
          {status === "loading" && (
            <p className="text-sm text-gray-500">Loading...</p>
          )}

          {status === "unauthenticated" && (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-black"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="bg-black text-white px-4 py-1.5 rounded-md text-sm font-medium hover:opacity-90"
              >
                Sign up
              </Link>
            </>
          )}

          {status === "authenticated" && session.user && (
            <>
              <span className="text-sm text-gray-600 hidden sm:block">
                {session.user.email}
              </span>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="bg-red-500 text-white px-4 py-1.5 rounded-md text-sm font-medium"
              >
                Logout
              </motion.button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
