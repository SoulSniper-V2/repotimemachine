"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 bg-[#FFFDF8] border-b-[3px] border-gray-900 z-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold tracking-normal hover:opacity-80 transition-opacity">
              <span className="text-gray-900">Repo</span>
              <span className="text-[#FE4A60]">Time</span>
              <span className="text-gray-900">Machine</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-6">
            <Link
              href="/"
              className={`font-semibold transition-transform hover:-translate-y-0.5 ${isHome ? "text-[#FE4A60]" : "text-gray-900"}`}
            >
              Home
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
