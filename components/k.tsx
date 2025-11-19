"use client";

import { useState } from "react";
import { MoreVertical, CheckCircle, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function UKMCard({ ukm }: { ukm: any }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // 🔥 Prevent card click
    setOpen(!open);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 🔥 Prevent card click
    if (!confirm("Hapus UKM ini?")) return;

    await fetch(`/api/ukm/${ukm.id}`, { method: "DELETE" });
    window.location.reload();
  };

  const toggleVerified = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 🔥 Prevent card click
    await fetch(`/api/ukm/${ukm.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified: !ukm.verified }),
    });
    window.location.reload();
  };

  const handleCardClick = () => {
    router.push(`/admin/ukm/${ukm.id}`); // 🔥 Navigate to profile
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-slate-800 border border-slate-700 p-4 rounded-lg shadow hover:shadow-lg hover:border-white transition relative cursor-pointer"
    >
      {/* Titik 3 */}
      <Button
        onClick={toggleMenu}
        className="absolute top-3 right-3 p-1 rounded hover:bg-slate-700 z-20"
      >
        <MoreVertical size={18} />
      </Button>

      {/* Popup Menu */}
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-2 top-10 bg-slate-900 border border-slate-700 rounded-lg p-2 w-36 shadow-lg z-30"
        >
          <button
            onClick={toggleVerified}
            className="flex items-center gap-2 p-2 hover:bg-slate-700 w-full text-left text-sm"
          >
            <CheckCircle size={16} />
            {ukm.verified ? "Batalkan Verifikasi" : "Verifikasi"}
          </button>

          <button
            onClick={handleDelete}
            className="flex items-center gap-2 p-2 hover:bg-red-600 w-full text-left text-sm text-red-400"
          >
            <Trash2 size={16} /> Hapus
          </button>
        </div>
      )}

      {/* Isi Card */}
      <div className="flex flex-col items-center mt-8">
        <Image
          src={ukm.imageUrl || "/placeholder.jpg"}
          alt={ukm.name}
          width={86}
          height={86}
          className="rounded-full mb-4 object-cover"
        />

        <h3 className="text-center font-semibold text-sm">{ukm.name}</h3>
        <p className="text-xs mt-1 text-slate-400">
          {ukm.verified ? "Terverifikasi" : "Belum verifikasi"}
        </p>
      </div>
    </div>
  );
}