"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import CreatePost from "./create-post";

type Post = {
  id: string;
  imageUrl: string;
  owner: {
    id: string;
  };
};

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const hasLoadedOnce = useRef(false);

  const { data: session, status } = useSession();

  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  async function handleDelete(postId: string) {
    const res = await fetch("/api/posts", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId }),
    });

    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    }
  }

  const loadPosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    const res = await fetch(`/api/posts${cursor ? `?cursor=${cursor}` : ""}`);

    if (!res.ok) {
      setLoading(false);
      return;
    }

    const data = await res.json();

    setPosts((prev) => {
      const map = new Map<string, Post>();
      [...prev, ...data.posts].forEach((post) => map.set(post.id, post));
      return Array.from(map.values());
    });

    setCursor(data.nextCursor);
    setHasMore(Boolean(data.nextCursor));
    setLoading(false);
  }, [cursor, loading, hasMore]);

  const refreshPosts = useCallback(() => {
    setPosts([]);
    setCursor(null);
    setHasMore(true);
    hasLoadedOnce.current = false;
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (hasLoadedOnce.current) return;

    hasLoadedOnce.current = true;
    loadPosts();
  }, [status, loadPosts]);

  useEffect(() => {
    if (!hasMore || loading) return;
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadPosts();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading, loadPosts]);

  if (status === "loading") {
    return <p className="text-center mt-10">Checking session...</p>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <CreatePost onPostCreated={refreshPosts} />

      <AnimatePresence>
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          {posts.map((post) => {
            const canDelete =
              session?.user?.role === "ADMIN" ||
              session?.user?.id === post.owner.id;

            return (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="relative bg-white rounded-xl shadow overflow-hidden group"
              >
                <div className="relative w-full aspect-square">
                  <img
                    src={post.imageUrl}
                    alt="post"
                    className="w-full object-cover"
                  />
                </div>

                {canDelete && (
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="absolute top-2 right-2 bg-red-600/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    Delete
                  </button>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {hasMore && (
        <div ref={loaderRef} className="h-12 flex justify-center items-center">
          {loading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 text-sm"
            >
              Loading more posts…
            </motion.p>
          )}
        </div>
      )}
    </div>
  );
}
