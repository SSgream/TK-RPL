"use client"

import { usePathname } from "next/navigation"
import Navbar from "./Navbar"
import ThemeToggle from "./ThemeToggle"

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith("/admin")
  const isPengurusRoute = pathname.startsWith("/pengurus")
  const isLoginRoute = pathname.startsWith("/login")

  // Tampilkan navbar HANYA jika BUKAN admin, pengurus, atau login
  const showNavbar = !isAdminRoute && !isPengurusRoute && !isLoginRoute

  return (
    <>
      {showNavbar && <Navbar />}
      <main className="container mx-auto p-6">{children}</main>
    </>
  )
}