"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";
import { Category } from "@/lib/types";
import { Search, SlidersHorizontal } from "lucide-react";

const CATEGORIES: ("All" | Category)[] = [
  "All",
  "Electronics",
  "Fashion",
  "Beauty",
  "Home",
  "Sports",
];

function ShopContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";

  const [selectedCategory, setSelectedCategory] = useState<"All" | Category>("All");
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<"default" | "price-low" | "price-high" | "rating">("default");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t) => t.includes(q)))
      );
    }

    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="pt-14 min-h-screen bg-[#121212]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Shop</h1>
          <p className="text-gray-400 text-sm">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, categories..."
            className="w-full bg-[#1a1a1a] text-white placeholder-gray-500 text-sm pl-9 pr-4 py-2.5 rounded-xl border border-white/10 focus:border-[#FE2C55] outline-none transition-colors"
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 text-sm font-semibold px-4 py-1.5 rounded-full transition-all ${
                selectedCategory === cat
                  ? "bg-[#FE2C55] text-white"
                  : "bg-[#1a1a1a] text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort / Filter toggle */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Sort & Filter
          </button>
          {showFilters && (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-[#1a1a1a] text-white text-sm border border-white/10 rounded-lg px-3 py-1.5 outline-none focus:border-[#FE2C55]"
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          )}
        </div>

        {/* Product grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-white font-semibold text-lg mb-2">No products found</p>
            <p className="text-gray-400 text-sm">Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  );
}

const ShopFallback = () => (
  <div className="pt-14 min-h-screen bg-[#121212] flex items-center justify-center">
    <div className="text-white">Loading...</div>
  </div>
);

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopContent />
    </Suspense>
  );
}
