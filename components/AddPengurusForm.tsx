"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "./ui/input"
import { Eye, EyeOff } from "lucide-react"

export default function AddPengurusForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    // Validasi input
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Semua field harus diisi!")
      return
    }

    setLoading(true)

    const res = await fetch("/api/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    })

    setLoading(false)

    if (res.ok) {
      alert("Pengurus berhasil ditambahkan!")
      onSuccess()
      window.location.reload()
    } else {
      const error = await res.json()
      alert(error.message || "Gagal menambah pengurus")
    }
  }

  return (
    <div className="space-y-4 mt-2">
      {/* Nama */}
      <div>
        <label className="text-sm text-slate-300 block mb-1">Nama Lengkap</label>
        <Input
          type="text"
          placeholder="Masukkan nama lengkap"
          className="w-full bg-slate-700 border border-slate-600 p-2 rounded mt-1 text-white placeholder:text-slate-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Email */}
      <div>
        <label className="text-sm text-slate-300 block mb-1">Email</label>
        <Input
          type="email"
          placeholder="contoh@email.com"
          className="w-full bg-slate-700 border border-slate-600 p-2 rounded mt-1 text-white placeholder:text-slate-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Password dengan Toggle */}
      <div>
        <label className="text-sm text-slate-300 block mb-1">Password</label>
        <div className="relative mt-1">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Minimal 6 karakter"
            className="w-full bg-slate-700 border border-slate-600 p-2 rounded pr-10 text-white placeholder:text-slate-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          * Password harus minimal 6 karakter
        </p>
      </div>

      {/* Tombol Simpan */}
      <div className="flex gap-2 pt-2">
        <Button 
          onClick={handleSubmit} 
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded transition"
        >
          {loading ? "Menyimpan..." : "Tambah Pengurus"}
        </Button>
      </div>
    </div>
  )
}