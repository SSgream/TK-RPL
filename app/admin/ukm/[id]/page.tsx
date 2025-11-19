"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl?: string | null;
  createdAt: string;
  author?: {
    name: string;
    email: string;
  };
}

interface UKMDetail {
  id: number;
  name: string;
  description: string;
  category: string;
  imageUrl?: string | null;
  verified: boolean;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  posts: Post[];
}

export default function UKMProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [ukm, setUkm] = useState<UKMDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadData = () => {
    fetch(`/api/ukm/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setUkm(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (params.id) loadData();
  }, [params.id]);

  const handleDeletePost = async () => {
    if (!selectedPost) return;
    if (!confirm("Yakin ingin menghapus postingan ini?")) return;

    try {
      setDeleting(true);

      const res = await fetch(`/api/posts/${selectedPost.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Gagal menghapus postingan");
        setDeleting(false);
        return;
      }

      alert("Postingan berhasil dihapus!");
      setSelectedPost(null);
      setShowPostModal(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!ukm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <p className="text-slate-400">UKM tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Tombol Kembali */}
      <div className="px-6">
        <Button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-300 hover:text-white bg-transparent hover:bg-slate-800"
        >
          <ArrowLeft size={24} />
        </Button>
      </div>

      <div className="max-w-4xl mx-auto pb-8">
        {/* Header Profile */}
        <div className="px-6 py-8 border-b border-slate-900 flex flex-col items-center text-center">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8 max-w-2xl mx-auto">
            <div className="flex-shrink-0">
              <Image
                src={ukm.imageUrl || "/placeholder.jpg"}
                alt={ukm.name}
                width={150}
                height={150}
                className="rounded-full border-2 border-slate-600 object-cover p-2 w-32 h-32 md:w-40 md:h-40"
              />
            </div>

            <div className="flex-1">
              <div className="text-start flex items-center gap-3 mb-3">
                <h1 className="text-2xl font-bold">{ukm.name}</h1>
              </div>

              <div className="text-sm text-slate-300">
                <p className="text-start whitespace-pre-line leading-relaxed">
                  {ukm.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid - 3 Columns */}
        <div className="px-2">
          {ukm.posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400 text-sm">Belum ada postingan</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {ukm.posts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => {
                    setSelectedPost(post);
                    setShowPostModal(true);
                    setShowPostMenu(false);
                  }}
                  className="aspect-square relative group cursor-pointer overflow-hidden"
                >
                  {post.imageUrl ? (
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800">
                      <div className="text-center p-4">
                        <p className="text-xs font-semibold line-clamp-2 mb-1">
                          {post.title}
                        </p>
                        <p className="text-xs text-slate-400 line-clamp-3">
                          {post.content}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-center text-white px-4">
                      {/* Optional: Add hover info here */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Detail Post (Instagram Style) */}
      {showPostModal && selectedPost && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPostModal(false);
          }}
        >
          <div className="bg-slate-800 rounded-xl w-full h-180 max-w-5xl relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700 relative">
              <div className="flex items-center gap-3">
                <Image
                  src={ukm?.imageUrl || "/placeholder.jpg"}
                  alt={ukm?.name || "UKM"}
                  width={32}
                  height={32}
                  className="ml-8 mr-2 rounded-full w-10 h-10 object-cover border border-slate-600"
                />
                <h2 className="text-lg font-semibold">{ukm?.name}</h2>
              </div>

              <div className="flex items-center gap-3">
                {/* TITIK TIGA */}
                <button
                  onClick={() => setShowPostMenu(!showPostMenu)}
                  className="text-slate-300 hover:text-white"
                >
                  •••
                </button>

                {/* TOMBOL CLOSE */}
                <Button
                  onClick={() => setShowPostModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X size={32} />
                </Button>
              </div>

              {/* MENU DELETE */}
              {showPostMenu && (
                <div className="absolute right-4 top-14 bg-slate-900 border border-slate-700 rounded-lg w-40 shadow-lg z-50">
                  <button
                    onClick={() => {
                      setShowPostMenu(false);
                      handleDeletePost();
                    }}
                    className="w-full text-center px-4 py-2 hover:bg-red-600 text-sm text-red-400"
                    disabled={deleting}
                  >
                    {deleting ? "Menghapus..." : "Hapus Post"}
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Gambar */}
              <div className="relative w-full h-full md:h-full bg-slate-900">
                {selectedPost.imageUrl ? (
                  <Image
                    src={selectedPost.imageUrl}
                    alt={selectedPost.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500">
                    Tidak ada gambar
                  </div>
                )}
              </div>

              {/* Detail */}
              <div className="p-6 space-y-4 overflow-y-auto h-170">
                <div>
                  <h3 className="text-xl font-bold">{selectedPost.title}</h3>
                  <p className="text-slate-400 text-sm">
                    {new Date(selectedPost.createdAt).toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="text-slate-300 whitespace-pre-line leading-relaxed">
                  {selectedPost.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}