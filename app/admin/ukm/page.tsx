"use client"

import { useEffect, useState } from "react"
import { getSession } from "next-auth/react"
import UKMCard from "@/components/k" // 🔥 Perbaiki import
import AddUKMButton from "@/components/AddUKMButton"
import { useRouter } from "next/navigation"

// 🔥 Definisikan tipe data UKM
interface UKM {
  id: number
  name: string
  description: string
  category: string
  imageUrl?: string | null
  verified: boolean
  createdBy: number
  createdAt: Date
  updatedAt: Date
}

export default function AdminUKMPage() {
  const router = useRouter()
  const [ukms, setUkms] = useState<UKM[]>([]) // 🔥 Tambah tipe data
  const [loading, setLoading] = useState(true) // 🔥 Tambah loading state

  // 🔐 CEK ROLE ADMIN
  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        router.push("/login")
        return
      }
      if (session.user.role !== "admin") {
        router.push("/") // atau redirect ke dashboard jika mau
        return
      }
      setLoading(false) // 🔥 Set loading false jika authorized
    })
  }, [router]) // 🔥 Tambah router ke dependency

  // 🔄 Ambil data UKM
  useEffect(() => {
    if (loading) return // 🔥 Jangan fetch kalau masih loading auth

    fetch("/api/ukm")
      .then(res => res.json())
      .then(data => setUkms(data))
      .catch(err => console.error("Error fetching UKM:", err))
  }, [loading]) // 🔥 Fetch setelah auth check selesai

  // 🔥 Tampilkan loading saat cek auth
  if (loading) {
    return (
      <main className="p-6 flex items-center justify-center min-h-screen">
        <p className="text-slate-400">Loading...</p>
      </main>
    )
  }

  return (
    <main className="p-6 relative">
      <h1 className="text-2xl font-bold mb-12">DAFTAR UKM</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-6">
        {ukms.length === 0 ? (
          <p className="text-slate-400 col-span-full text-center">
            Belum ada UKM. Klik tombol + untuk menambahkan.
          </p>
        ) : (
          ukms.map((ukm) => (
            <UKMCard key={ukm.id} ukm={ukm} />
          ))
        )}
      </div>

      <AddUKMButton />
    </main>
  )
}