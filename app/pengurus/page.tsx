"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

export default function PengurusProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ukm, setUkm] = useState<UKMDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Tambah posting modal
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Modal Detail Post
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);

  // Titik 3 menu
  const [showPostMenu, setShowPostMenu] = useState(false);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editUploading, setEditUploading] = useState(false);

  // Edit Profil UKM
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileDescription, setProfileDescription] = useState("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Ambil data UKM milik pengurus yang login
  // Ganti fungsi loadUKMData dengan ini:
const loadUKMData = async () => {
  try {
    const res = await fetch("/api/ukm/my-ukm", {
      credentials: "include"
    });
    
    if (res.ok) {
      const detailData = await res.json();
      setUkm(detailData);
    } else {
      setUkm(null);
    }
  } catch (error) {
    console.error("Error loading UKM:", error);
    setUkm(null);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (status === "authenticated") {
      loadUKMData();
    }
  }, [status]);

  // Simpan postingan baru
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let uploadedImageUrl = "";

      // 1️⃣ Upload ke Cloudinary
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("file", imageFile);
        uploadData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
        );

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: uploadData,
          }
        );

        const uploadJson = await uploadRes.json();

        if (!uploadRes.ok || !uploadJson.secure_url) {
          console.error("Upload error:", uploadJson);
          alert("Upload gagal!");
          return;
        }

        uploadedImageUrl = uploadJson.secure_url;
      }

      // 2️⃣ Kirim ke API Next.js
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("ukmId", ukm?.id.toString() || "");
      formData.append("imageUrl", uploadedImageUrl);

      const res = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setTitle("");
        setContent("");
        setImageFile(null);
        setShowModal(false);
        loadUKMData();
        alert("Postingan berhasil ditambahkan!");
      } else {
        const error = await res.json();
        alert(error.error || "Gagal menambah postingan");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan");
    }
  };

  // DELETE post
  const handleDeletePost = async (postId: number) => {
    try {
      const confirmDelete = confirm("Yakin ingin menghapus postingan?");
      if (!confirmDelete) return;

      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Postingan dihapus");
        setShowPostModal(false);
        loadUKMData();
      } else {
        const err = await res.json();
        console.error("Delete error:", err);
        alert("Gagal menghapus postingan");
      }
    } catch (err) {
      console.error("Delete exception:", err);
      alert("Terjadi kesalahan saat menghapus");
    }
  };

  // Open edit modal and populate fields
  const openEditModal = (post: Post) => {
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditImageFile(null); // by default no new file
    setShowPostMenu(false);
    setShowEditModal(true);
  };

  // Submit edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost) return;

    try {
      setEditUploading(true);

      let newImageUrl = selectedPost.imageUrl || "";

      // if new image provided, upload to Cloudinary
      if (editImageFile) {
        const uploadData = new FormData();
        uploadData.append("file", editImageFile);
        uploadData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
        );

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: uploadData,
          }
        );

        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok || !uploadJson.secure_url) {
          console.error("Upload error:", uploadJson);
          alert("Gagal upload gambar baru");
          setEditUploading(false);
          return;
        }

        newImageUrl = uploadJson.secure_url;
      }

      // Prepare payload (we use FormData to match POST handler)
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("content", editContent);
      formData.append("imageUrl", newImageUrl);

      const res = await fetch(`/api/posts/${selectedPost.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
          imageUrl: newImageUrl,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        alert("Postingan berhasil diperbarui");
        setShowEditModal(false);
        setShowPostModal(false);
        loadUKMData();
      } else {
        const err = await res.json();
        console.error("Update error:", err);
        alert(err.error || "Gagal memperbarui postingan");
      }
    } catch (err) {
      console.error("Edit exception:", err);
      alert("Terjadi kesalahan saat mengedit");
    } finally {
      setEditUploading(false);
    }
  };

  // Submit edit profile UKM
  const handleEditProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let newLogoUrl = ukm?.imageUrl || "";

      // Upload logo baru jika ada
      if (profileImageFile) {
        const uploadData = new FormData();
        uploadData.append("file", profileImageFile);
        uploadData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
        );

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: uploadData }
        );

        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok || !uploadJson.secure_url) {
          alert("Upload logo gagal");
          return;
        }

        newLogoUrl = uploadJson.secure_url;
      }

      const res = await fetch(`/api/ukm/${ukm?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileName,
          description: profileDescription,
          imageUrl: newLogoUrl,
        }),
      });

      if (res.ok) {
        alert("Profil UKM berhasil diperbarui!");
        setShowEditProfileModal(false);
        loadUKMData();
      } else {
        alert("Gagal memperbarui profil");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan profil");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (!ukm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">
            Anda belum terdaftar di UKM manapun
          </p>
          <p className="text-slate-500 text-sm">
            Hubungi admin untuk mendaftarkan UKM Anda
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto pt-20 pb-8">
        {/* Header Profile */}
        <div className="px-6 py-8 border-b border-slate-900 flex flex-col items-center text-center ">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8 max-w-2xl mx-auto mb-8">
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
          <button
            onClick={() => {
              setProfileName(ukm.name);
              setProfileDescription(ukm.description);
              setProfileImageFile(null);
              setShowEditProfileModal(true);
            }}
            className="mt-4 px-24 py-1 bg-gray-950 border border-white hover:bg-gray-700 text-white rounded-lg text-sm"
          >
            Edit Profil UKM
          </button>
        </div>

        {/* Posts Grid - 3 Columns */}
        <div className="px-2">
          {ukm.posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-block p-4 border-2 border-slate-700 rounded-full mb-4">
                <Plus size={40} className="text-slate-600" />
              </div>
              <p className="text-slate-400 text-sm">Belum ada postingan</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 text-sky-500 hover:text-sky-400 font-semibold text-sm"
              >
                Buat postingan pertama
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              <div
                onClick={() => setShowModal(true)}
                className="w-full max-w-lg h-73 border-2 border-dashed border-slate-500  flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800 transition duration-200"
              >
                <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center">
                  <span className="text-3xl">+</span>
                </div>
                <p className="mt-3 text-slate-300 font-medium">
                  Tambah Postingan
                </p>
              </div>

              {ukm.posts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => {
                    setSelectedPost(post);
                    setShowPostModal(true);
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
                     
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Tambah Postingan */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="bg-gray-950 border border-gray-500 rounded-xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold">Buat Postingan Baru</h2>
              <Button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={24} />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium mb-2"
                >
                  Judul
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Tambahkan judul..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-sky-500 focus:outline-none text-white"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium mb-2"
                >
                  Deskripsi
                </label>
                <textarea
                  id="content"
                  placeholder="Tulis deskripsi..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-sky-500 focus:outline-none text-white h-24 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload Gambar
                </label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Pilih gambar untuk postingan
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold transition"
              >
                Bagikan
              </button>
            </form>
          </div>
        </div>
      )}

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
                        src={ukm?.imageUrl || "/placeholder.jpg"} // Menggunakan logo UKM
                        alt={selectedPost.author?.name || "UKM"}
                        width={32} // Ukuran kecil untuk logo header
                        height={32}
                        className="ml-8 mr-2 rounded-full w-10 h-10 object-cover border border-slate-600"
                    />
                    <h2 className="text-lg font-semibold">
                        {ukm?.name}
                    </h2>
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

              {/* MENU EDIT / DELETE */}
              {showPostMenu && (
                <div className="absolute right-4 top-14 bg-slate-900 border border-slate-700 rounded-lg w-40 shadow-lg z-50">
                  <button
                    onClick={() => {
                      openEditModal(selectedPost);
                    }}
                    className="w-full text-center px-4 py-2 hover:bg-slate-700 text-sm"
                  >
                    Edit Post
                  </button>

                  <button
                    onClick={() => {
                      // close menu then delete
                      setShowPostMenu(false);
                      handleDeletePost(selectedPost.id);
                    }}
                    className="w-full text-center px-4 py-2 hover:bg-red-600 text-sm text-red-400"
                  >
                    Hapus Post
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

      {/* Modal Edit Post */}
      {showEditModal && selectedPost && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowEditModal(false);
          }}
        >
          <div className="bg-slate-800 rounded-xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold">Edit Postingan</h2>
              <Button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={24} />
              </Button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-4 space-y-6">
              <div>
                <label
                  htmlFor="editTitle"
                  className="block text-sm font-medium mb-2"
                >
                  Judul
                </label>
                <input
                  id="editTitle"
                  type="text"
                  placeholder="Judul..."
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-sky-500 focus:outline-none text-white"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="editContent"
                  className="block text-sm font-medium mb-2"
                >
                  Deskripsi
                </label>
                <textarea
                  id="editContent"
                  placeholder="Deskripsi..."
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-sky-500 focus:outline-none text-white h-24 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Ganti Gambar (opsional)
                </label>
                <Input
                  id="editImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setEditImageFile(e.target.files?.[0] || null)
                  }
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Biarkan kosong jika tidak ingin mengganti gambar
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={editUploading}
                  className="flex-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold transition"
                >
                  {editUploading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                >
                  Batal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Profil UKM */}
      {showEditProfileModal && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowEditProfileModal(false);
          }}
        >
          <div className="bg-gray-950 border border-gray-500 rounded-xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold">Edit Profil UKM</h2>
              <Button
                onClick={() => setShowEditProfileModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={24} />
              </Button>
            </div>

            <form onSubmit={handleEditProfileSubmit} className="p-4 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nama UKM
                </label>
                <Input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Deskripsi
                </label>
                <Textarea
                  value={profileDescription}
                  onChange={(e) => setProfileDescription(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white h-28 resize-none"
                  required
                ></Textarea>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Ganti Logo (opsional)
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setProfileImageFile(e.target.files?.[0] || null)
                  }
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold transition"
              >
                Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
