"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Home, Building2, Info, LogOut, LogIn, Menu, X, LayoutDashboard } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Beranda", icon: Home },
    { href: "/daftarukm", label: "Daftar UKM", icon: Building2 },
    { href: "/about", label: "Tentang", icon: Info },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-gray-950 border-b border-slate-800 fixed top-0 right-0 left-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex items-center justify-center">
                <span className="bg-gradient-to-r from-red-700 to-gray-700 bg-clip-text text-transparent font-bold text-2xl tracking-tight">
                  SMFT-UH
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.href)
                      ? "bg-slate-700 text-white shadow-md"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                {/* Dashboard Button */}
                {session.user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all shadow-md hover:shadow-lg"
                  >
                    <LayoutDashboard size={18} />
                    <span>Admin</span>
                  </Link>
                )}
                {session.user?.role === "pengurus" && (
                  <Link
                    href="/pengurus"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium transition-all shadow-md hover:shadow-lg"
                  >
                    <LayoutDashboard size={18} />
                    <span>Pengurus</span>
                  </Link>
                )}
                
                {/* Logout Button */}
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-all shadow-md hover:shadow-lg"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-red-700 hover:from-gray-600 hover:to-red-600 text-white text-sm font-medium transition-all shadow-md hover:shadow-lg"
              >
                <LogIn size={18} />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 shadow-xl">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.href)
                      ? "bg-slate-700 text-white shadow-md"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile User Info */}
          <div className="border-t border-slate-800 px-4 py-4">
            {session ? (
              <div className="space-y-2">
                {/* User Info Card */}
                <div className="bg-slate-800 rounded-lg p-3 mb-3">
                  <p className="text-white font-semibold">{session.user?.name}</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {session.user?.role === "admin" ? "Administrator" : 
                     session.user?.role === "pengurus" ? "Pengurus UKM" : "User"}
                  </p>
                </div>

                {/* Dashboard Button */}
                {session.user?.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all shadow-md"
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard Admin</span>
                  </Link>
                )}
                {session.user?.role === "pengurus" && (
                  <Link
                    href="/pengurus"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium transition-all shadow-md"
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard Pengurus</span>
                  </Link>
                )}

                {/* Logout Button */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: "/login" });
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-all shadow-md"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-gray-700 to-red-700 hover:from-gray-600 hover:to-red-600 text-white text-sm font-medium transition-all shadow-md"
              >
                <LogIn size={18} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}