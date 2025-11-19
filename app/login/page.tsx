"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError(result.error)
      return
    }

    // Ambil session setelah login
    const session = await fetch("/api/auth/session").then(res => res.json())

    if (session?.user?.role === "admin") {
      router.push("/admin")
    } else if (session?.user?.role === "pengurus") {
      router.push("/pengurus")
    } else {
      setError("Role tidak dikenali")
    }
  }

  const handleClose = () => {
    router.push("/") // Redirect ke halaman utama
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleLogin}
        className="relative w-[350px] h-100 p-6 bg-gray-950 border-white border-1 rounded-sm shadow-lg"
      >
        {/* Tombol X */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 rounded-full "
          aria-label="Close"
        >
          <X className="w-6 h-6 text-white bg-gray-950!" />
        </button>

        <h2 className="text-xl font-bold mt-4 mb-4 text-white text-center">
          Login
        </h2>

        <h2 className="text-3xl font-bold mb-20 text-white text-center font-[Poppins]">
          Admin/Pengurus
        </h2>

        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mb-3 text-black"
        />

        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="mb-8 text-black"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <Button type="submit" className="w-full bg-white text-black">
          Masuk
        </Button>
      </form>
    </div>
  )
}