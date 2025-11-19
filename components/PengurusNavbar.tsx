"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Calendar, 
  FileText, 
  User, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export default function PengurusNavbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/pengurus", label: "Dashboard", icon: Home },
    { href: "/pengurus/profil", label: "Profil", icon: User },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-gray-950 border-b border-slate-800 fixed top-0 right-0 left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center"> 
            <Link href="/pengurus" className="flex items-center space-x-3">
              <div className="w-40 h-10  to-black rounded-lg flex items-center justify-center">
                <span className="bg-gradient-to-r from-red-700 to-gray-700 bg-clip-text text-transparent font-bold text-3xl">SMFT-UH</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="text-right">
              <p className="text-white font-[Poppins] text-2xl">
                {session?.user?.name}
              </p>
              <p className="text-slate-400 text-xs">{session?.user?.email}</p>
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-red-700 text-white transition"
            >
              <LogOut size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-700"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-700">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive(item.href)
                      ? "bg-sky-600 text-white"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile User Info */}
          <div className="border-t border-slate-700 px-4 py-4">
            <div className="mb-3">
              <p className="text-white font-medium">{session?.user?.name}</p>
              <p className="text-slate-400 text-sm">{session?.user?.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
            >
              <LogOut size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}