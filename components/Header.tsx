"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Search, User, Music2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#121212]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 group">
          <div className="w-7 h-7 bg-[#FE2C55] rounded-md flex items-center justify-center">
            <Music2 className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Tik<span className="text-[#FE2C55]">Shop</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
          >
            Home
          </Link>
          <Link
            href="/shop"
            className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
          >
            Shop
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {showSearch ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                autoFocus
                className="bg-white/10 text-white placeholder-gray-400 text-sm rounded-full px-4 py-1.5 outline-none border border-white/20 focus:border-[#FE2C55] w-48 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="text-gray-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="text-gray-300 hover:text-white transition-colors p-1"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          <Link
            href="/cart"
            className="relative text-gray-300 hover:text-white transition-colors p-1"
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FE2C55] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          <Link
            href="#"
            className="text-gray-300 hover:text-white transition-colors p-1"
            aria-label="Profile"
          >
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
