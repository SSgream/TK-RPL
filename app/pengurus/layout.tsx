"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PengurusNavbar from "@/components/PengurusNavbar";

export default function PengurusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.role !== "pengurus" && session?.user?.role !== "admin") {
      router.push("/"); // Redirect jika bukan pengurus
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || 
      (session?.user?.role !== "pengurus" && session?.user?.role !== "admin")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <PengurusNavbar />
      <main>{children}</main>
    </div>
  );
}