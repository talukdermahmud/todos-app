// src/components/layout/Sidebar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const pathname = usePathname();

  const user = {
    name: "amanuel",
    email: "amanuel@gmail.com",
    avatar: "/images/avatar.png",
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "/icons/home.png" },
    { href: "/todos", label: "Todos", icon: "/icons/task.png" },
    { href: "/profile", label: "Account Information", icon: "/icons/user.png" },
    {
      href: "/password-change",
      label: "Password Change",
      icon: "/icons/user.png",
    },
  ];

  return (
    <aside className="w-80 bg-[#0D224A] flex flex-col items-center py-10 text-white">
      {/* User Avatar + Info */}
      <div className="mb-16 text-center">
        <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-white/20">
          <Image
            src={user.avatar}
            alt={user.name}
            width={112}
            height={112}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="mt-6 text-xl font-semibold">{user.name}</p>
        <p className="text-sm text-gray-400">{user.email}</p>
      </div>

      {/* Navigation */}
      <nav className="w-full flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`relative flex items-center gap-5 px-10 py-4 transition-all overflow-hidden ${
                    isActive
                      ? "text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {/* Gradient background only on active item */}
                  {isActive && (
                    <div className="absolute inset-0 bg-linear-to-r from-[#5272FF50] via-[#0D224A] to-[#0D224A]" />
                  )}

                  {/* Content */}
                  <div className="relative flex items-center gap-5 z-10">
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={24}
                      height={24}
                      className={`w-6 h-6 ${
                        isActive ? "brightness-0 invert" : ""
                      }`}
                    />
                    <span className="text-lg font-medium">{item.label}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="w-full mt-auto">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-5 px-10 py-4 text-gray-400 hover:text-white hover:bg-white/5 transition-all w-full"
        >
          <Image
            src="/icons/logout.png"
            alt="Logout"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <span className="text-lg font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
