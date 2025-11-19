"use client"

import { useState } from "react"
import { Input } from "./ui/input"
import { Eye, EyeOff } from "lucide-react"

interface Pengurus {
  id: number
  name: string
  email: string
  role: string
}

interface EditPengurusModalProps {
  pengurus: Pengurus
  onClose: () => void
}

export default function EditPengurusModal({ pengurus, onClose }: EditPengurusModalProps) {
  const [name, setName] = useState(pengurus.name)
  const [email, setEmail] = useState(pengurus.email)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    setLoading(true)

    const payload: any = { name, email }
    
    if (password.trim() !== "") {
      payload.password = password
    }

    await fetch(`/api/pengurus/${pengurus.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    window.location.reload()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-gray-950 text-left p-6 rounded-lg w-96 border border-slate-600">
        <h2 className="text-xl font-bold mb-4">Edit Pengurus</h2>

        <label className="text-sm text-slate-300">Nama</label>
        <Input
          className="w-full p-2 bg-slate-700 border border-slate-600 rounded mb-3 mt-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="text-sm text-slate-300">Email</label>
        <Input
          className="w-full p-2 bg-slate-700 border border-slate-600 rounded mb-3 mt-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="text-sm text-slate-300">Password Baru (opsional)</label>
        <div className="relative mb-4 mt-1">
          <Input
            type={showPassword ? "text" : "password"}
            className="w-full p-2 bg-slate-700 border border-slate-600 rounded pr-10"
            placeholder="Kosongkan jika tidak ingin mengubah"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          * Kosongkan kolom password jika tidak ingin mengubah password
        </p>

        <div className="flex justify-end gap-2">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded transition"
          >
            Batal
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 rounded transition"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  )
}
