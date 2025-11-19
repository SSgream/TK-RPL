// app/admin/layout.tsx
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import AdminSidebar from "@/components/admin/AdminSideBar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session) redirect("/login")
  if (session.user.role !== "admin") redirect("/admin")

  return (
    <div className="flex min-h-screen bg-gray-950 text-slate-100">
      {/* Sidebar */}
      <AdminSidebar />
      {/* Konten */}
      <main className="flex-1 p-6 ml-54">{children}</main>
    </div>
  )
}
