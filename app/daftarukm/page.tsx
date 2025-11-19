"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Building2, Users } from "lucide-react";

interface UKM {
  id: number;
  name: string;
  description: string;
  category: string;
  imageUrl?: string | null;
  verified: boolean;
  createdAt: string;
  _count?: {
    posts: number;
  };
}

export default function DaftarUKMPage() {
  const router = useRouter();
  const [ukms, setUkms] = useState<UKM[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUKMs();
  }, []);

  const fetchUKMs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/ukm");

      if (!res.ok) {
        throw new Error("Gagal memuat data UKM");
      }

      const data = await res.json();
      setUkms(data);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data UKM");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Memuat data UKM...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchUKMs}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Daftar UKM</h1>
          <p className="text-slate-400">
            Jelajahi Unit Kegiatan Mahasiswa di Fakultas Teknik Universitas
            Hasanuddin
          </p>
        </div>

        {/* Grid Cards */}
        {ukms.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 rounded-lg border border-slate-700">
            <Building2 size={64} className="mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400 text-lg">Belum ada UKM terdaftar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ukms.map((ukm) => (
              <div
                key={ukm.id}
                onClick={() => router.push(`/daftarukm/${ukm.id}`)}
                className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden hover:border-white hover:shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer group"
              >
                {/* Image */}
                <div className="relative w-full h-48 bg-slate-800 overflow-hidden flex items-center justify-center">
                  {ukm.imageUrl ? (
                    <Image
                      src={ukm.imageUrl || "/placeholder.jpg"}
                      alt={ukm.name}
                      width={156}
                      height={156}
                      className="rounded-full mb-4 object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 size={64} className="text-slate-600" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg text-center font-bold mb-1 group-hover:text-blue-400 transition line-clamp-1">
                    {ukm.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
