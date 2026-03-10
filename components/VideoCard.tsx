"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { Heart, ShoppingBag, Share2, Music2 } from "lucide-react";
import { useState } from "react";

interface VideoCardProps {
  product: Product;
  isActive: boolean;
}

export default function VideoCard({ product, isActive }: VideoCardProps) {
  const { addToCart } = useCart();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(product.likes);
  const [added, setAdded] = useState(false);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const formatLikes = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center transition-opacity duration-300 ${
        isActive ? "opacity-100" : "opacity-60"
      }`}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority={isActive}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
      </div>

      {/* Right-side actions */}
      <div className="absolute right-3 bottom-28 flex flex-col items-center gap-5 z-10">
        {/* Like */}
        <button onClick={handleLike} className="flex flex-col items-center gap-1">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 ${
              liked ? "bg-[#FE2C55]/20" : "bg-black/40"
            }`}
          >
            <Heart
              className={`w-6 h-6 transition-colors ${
                liked ? "text-[#FE2C55] fill-[#FE2C55]" : "text-white"
              }`}
            />
          </div>
          <span className="text-white text-xs font-semibold drop-shadow">
            {formatLikes(likeCount)}
          </span>
        </button>

        {/* Cart */}
        <button
          onClick={handleAddToCart}
          className="flex flex-col items-center gap-1"
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 ${
              added ? "bg-green-500/80" : "bg-black/40"
            }`}
          >
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-semibold drop-shadow">Cart</span>
        </button>

        {/* Share */}
        <button className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full bg-black/40 flex items-center justify-center active:scale-90 transition-all">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-semibold drop-shadow">Share</span>
        </button>

        {/* Spinning disc */}
        <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border-4 border-[#333] flex items-center justify-center animate-spin-slow">
          <Music2 className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-16 p-4 z-10">
        <p className="text-white text-xs font-semibold mb-1 opacity-80">
          @tikshop_official
        </p>
        <h2 className="text-white font-bold text-base leading-tight mb-2 line-clamp-2">
          {product.name}
        </h2>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#FE2C55] font-bold text-lg">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-gray-400 text-sm line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <Link href={`/product/${product.id}`}>
          <button className="flex items-center gap-2 bg-[#FE2C55] text-white font-bold text-sm px-5 py-2.5 rounded-full active:scale-95 transition-all hover:bg-[#e6274d]">
            <ShoppingBag className="w-4 h-4" />
            Shop Now
          </button>
        </Link>
      </div>

      {added && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-semibold animate-fade-in-out pointer-events-none z-20">
          Added to cart! 🛒
        </div>
      )}
    </div>
  );
}
