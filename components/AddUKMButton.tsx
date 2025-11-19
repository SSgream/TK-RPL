"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "./ui/button";

export default function AddUKMButton() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);

  const [lists, setPengurus] = useState([]);
  const [createdBy, setCreatedBy] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetch("/api/lists")
      .then((res) => res.json())
      .then((data) => setPengurus(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/ukm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description: desc,
        category,
        createdBy: Number(createdBy),
      }),
    });

    if (res.ok) {
      alert("UKM berhasil ditambahkan!");
      setOpen(false);
      setName("");
      setDesc("");
      setCategory("");
      setCreatedBy("");
      window.location.reload();
    } else {
      alert("Gagal menambahkan UKM!");
    }
  };

  return (
    <>
      {/* Floating Button - Solusi 2 Style */}
      <Button
        onClick={toggle}
        className="fixed bottom-15 right-14 bg-gray-950 hover:bg-gray-400 w-16 h-16 flex items-center justify-center border border-white text-white rounded-full shadow-lg transition-all hover:scale-110 z-50"
      >
        <Plus size={24} />
      </Button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <form
            onSubmit={handleSubmit}
            className="relative bg-gray-950 border border-slate-600 p-6 rounded-lg w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header dengan Tombol Close */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white">Tambah UKM</h2>
              <Button
                type="button"
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X size={24} />
              </Button>
            </div>

            {/* Input Nama UKM */}
            <div className="mb-4">
              <label className="text-sm text-slate-300 block mb-1">
                Nama UKM
              </label>
              <input
                type="text"
                className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white placeholder:text-slate-500"
                placeholder="Contoh: HIMAKOM"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Input Deskripsi */}
            <div className="mb-4">
              <label className="text-sm text-slate-300 block mb-1">
                Deskripsi
              </label>
              <textarea
                className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white placeholder:text-slate-500 h-24 resize-none"
                placeholder="Deskripsi singkat tentang UKM..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                required
              />
            </div>

            {/* Input Kategori */}
            <div className="mb-4">
              <label className="text-sm text-slate-300 block mb-1">
                Kategori
              </label>
              <input
                type="text"
                className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white placeholder:text-slate-500"
                placeholder="Contoh: Olahraga, Seni, dll"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>

            {/* Dropdown Pengurus */}
            <div className="mb-6">
              <label className="text-sm text-slate-300 block mb-1">
                Pengurus
              </label>
              <select
                title="Pilih pengurus"
                className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white"
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
                required
              >
                <option value="" className="text-slate-500">
                  -- Pilih Pengurus --
                </option>
                {lists.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 w-full p-3 rounded text-white font-semibold transition"
            >
              Tambah UKM
            </button>
          </form>
        </div>
      )}
    </>
  );
}