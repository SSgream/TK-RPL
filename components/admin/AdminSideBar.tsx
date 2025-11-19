"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Building2, Users, LogOut } from "lucide-react";

export default function SidebarAdmin() {
  const pathname = usePathname();

  const menu = [
    { 
      name: "Dashboard", 
      href: "/admin",
      icon: LayoutDashboard
    },
    { 
      name: "UKM", 
      href: "/admin/ukm",
      icon: Building2
    },
    { 
      name: "Akun Pengurus", 
      href: "/admin/pengurus",
      icon: Users
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 h-screen p-6 border-r border-slate-700 fixed left-0 top-0 flex flex-col justify-between shadow-xl">
      {/* Header */}
      <div>
        {/* Logo/Title Section */}
        <div className="mt-12 mb-8 pb-6 border-b border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-red-700 to-gray-700 bg-clip-text text-transparent">SMFT-UH</h2>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Senat Mahasiswa Fakultas Teknik<br/>Universitas Hasanuddin
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-slate-700 text-white shadow-lg shadow-slate-600/50"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={20} className={isActive ? "text-white" : "text-slate-400"} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer - Logout Button */}
      <div className="border-t border-slate-700 pt-4">
        <button
          onClick={() => signOut()}
          className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-red-600/50"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}