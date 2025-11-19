// app/page.tsx atau pages/index.tsx
"use client"; // Jika menggunakan App Router

import React, { useState, useEffect } from "react";
import { Heart, MessageCircle, Send, Bookmark, User } from "lucide-react";

interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  author: {
    id: number;
    name: string;
    email: string;
  } | null;
  ukm: {
    id: number;
    name: string;
    verified: boolean;
    imageUrl: string | null;
  } | null;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set());
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/posts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Posts fetched:", data);
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Gagal memuat posts. Silakan refresh halaman.");
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (postId: number) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleSave = (postId: number) => {
    setSavedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleExpand = (postId: number) => {
    setExpandedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return "Baru saja";
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Function to check if content needs truncation
  const needsTruncation = (content: string) => {
    return content.length > 100; // Adjust this number based on your needs
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Memuat posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchPosts}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Feed */}
      <main className="max-w-xl mt-12 mx-auto py-6 px-4">
        {posts.length === 0 ? (
          <div className="text-center py-12 rounded-lg border border-slate-700 bg-slate-900">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-slate-400 text-lg font-medium mb-2">
              Belum ada posts
            </p>
            <p className="text-slate-500 text-sm">
              Jadilah yang pertama membuat post!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="border border-slate-700 bg-gray-950 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
              >
                {/* Post Header */}
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="ml-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-slate-600 flex items-center justify-center text-white font-semibold overflow-hidden">
                      {post.ukm?.imageUrl ? (
                        <img
                          src={post.ukm.imageUrl}
                          alt={post.ukm.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-sm text-white">
                          {post.ukm?.name || post.author?.name || "Anonymous"}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Post Image */}
                {post.imageUrl && (
                  <div className="w-full relative bg-slate-800">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full max-h-[700px] object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}

                {/* Post Actions */}
                <div className="ml-2 px-4 py-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-4">
                      <Heart
                        className={`w-7 h-7 cursor-pointer transition ${
                          likedPosts.has(post.id)
                            ? "fill-red-500 text-red-500"
                            : "text-white hover:text-slate-400"
                        }`}
                        onClick={() => toggleLike(post.id)}
                      />
                      <MessageCircle className="w-7 h-7 text-white cursor-pointer hover:text-slate-400 transition" />
                      <Send className="w-7 h-7 text-white cursor-pointer hover:text-slate-400 transition" />
                    </div>
                    <Bookmark
                      className={`w-6 h-6 cursor-pointer transition ${
                        savedPosts.has(post.id)
                          ? "fill-white text-white"
                          : "text-white hover:text-slate-400"
                      }`}
                      onClick={() => toggleSave(post.id)}
                    />
                  </div>

                  {/* Post Content */}
                  <div className="mb-2">
                    <p className="font-semibold text-sm mb-1 text-white">
                      {post.title}
                    </p>
                    <div className="text-sm text-gray-200">
                      {expandedPosts.has(post.id) ? (
                        // Full content
                        <span className="whitespace-pre-line">
                          {post.content}
                        </span>
                      ) : (
                        // Truncated content (2 lines)
                        <span className="line-clamp-2">{post.content}</span>
                      )}

                      {/* Show "Selengkapnya" button only if content is long */}
                      {needsTruncation(post.content) && (
                        <button
                          onClick={() => toggleExpand(post.id)}
                          className="text-gray-500 hover:text-slate-300 font-medium ml-1 transition"
                        >
                          {expandedPosts.has(post.id)
                            ? "Lebih sedikit"
                            : "Selengkapnya"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
