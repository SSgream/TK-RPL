// components/ThemeToggle.tsx
"use client"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const [dark, setDark] = useState(true)
  useEffect(() => {
    const root = document.documentElement
    if (dark) root.classList.add("dark")
    else root.classList.remove("dark")
  }, [dark])

  return (
    <button
      onClick={() => setDark(!dark)}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-slate-800 text-white shadow-lg"
      aria-label="Toggle theme"
    >
      {dark ? "🌙" : "☀️"}
    </button>
  )
}
