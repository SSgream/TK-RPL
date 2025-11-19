import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import PengurusMenu from "@/components/PengurusMenu";
import AddPengurusButton from "@/components/AddPengurusButton";

export default async function AdminPengurusPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user?.role !== "admin") redirect("/");

  const pengurus = await prisma.user.findMany({
    where: { role: "pengurus" },
    include: {
      ukms: true,
    },
    orderBy: { id: "asc" },
  });

  return (
    <main className="p-6 text-slate-100">
      <h1 className="text-2xl font-bold mb-12">DAFTAR AKUN PENGURUS UKM</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-slate-800 rounded-2xl">
          <thead className="bg-slate-700">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">UKM</th>
              <th className="p-3 text-left w-10"></th>
            </tr>
          </thead>

          <tbody>
            {pengurus.map((p) => (
              <tr
                key={p.id}
                className="border-t border-slate-700 hover:bg-slate-700/40 transition"
              >
                <td className="p-3">{p.id}</td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.email}</td>
                <td className="p-3">
                  {p.ukms.length > 0 ? (
                    p.ukms.map((u) => u.name).join(", ")
                  ) : (
                    <span className="text-slate-400 italic">
                      Belum punya UKM
                    </span>
                  )}
                </td>
                {/* 🔥 Tombol titik tiga */}
                <td className="p-3 text-center">
                  <PengurusMenu pengurus={p} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <AddPengurusButton />
      </div>
    </main>
  );
}
