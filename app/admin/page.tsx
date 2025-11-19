// app/admin/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")
  if (session.user?.role !== "admin") redirect("/")

  const totalUKM = await prisma.uKM.count()
  const ukmVerified = await prisma.uKM.count({
    where: { verified: true },
  })
  const totalPosts = await prisma.post.count()

  return (
    <main className="p-6 bg-gray-950 min-h-screen">

      <h1 className="text-2xl font-bold mb-12">
        STATISTIK PENGGUNAAN
      </h1>

      {/* GRID CARD STATISTIK */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total UKM */}
        <div className="
          p-6 rounded-lg shadow 
          bg-white border border-gray-300 
          dark:bg-slate-800 dark:border-slate-700
        ">
          <h3 className="text-sm text-gray-600 dark:text-slate-400">
            Total UKM
          </h3>
          <p className="text-3xl font-bold mt-2">{totalUKM}</p>
        </div>

        {/* UKM Terverifikasi */}
        <div className="
          p-6 rounded-lg shadow 
          bg-white border border-gray-300 
          dark:bg-slate-800 dark:border-slate-700
        ">
          <h3 className="text-sm text-gray-600 dark:text-slate-400">
            UKM Terverifikasi
          </h3>
          <p className="text-3xl font-bold mt-2">{ukmVerified}</p>
        </div>

        {/* Total Postingan */}
        <div className="
          p-6 rounded-lg shadow 
          bg-white border border-gray-300 
          dark:bg-slate-800 dark:border-slate-700
        ">
          <h3 className="text-sm text-gray-600 dark:text-slate-400">
            Total Postingan
          </h3>
          <p className="text-3xl font-bold mt-2">{totalPosts}</p>
        </div>

      </div>
    </main>
  )
}
