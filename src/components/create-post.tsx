"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CreatePost({
  onPostCreated,
}: {
  onPostCreated: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/posts", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (res.ok) {
      setFile(null);
      setPreview(null);
      onPostCreated();
    } else {
      alert("Failed to create post");
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-4 rounded-xl shadow space-y-4"
    >
      <label className="block text-sm font-medium text-gray-700">
        Upload Image
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-black file:text-white
          hover:file:bg-gray-800"
      />

      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg overflow-hidden"
          >
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        disabled={loading || !file}
        className="w-full bg-black text-white py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Post"}
      </motion.button>
    </motion.form>
  );
}
