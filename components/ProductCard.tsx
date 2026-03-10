"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export default function ProductCard({
  product,
  showAddToCart = true,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const isOnSale = !!product.originalPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discount = isOnSale
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100
      )
    : 0;

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5 hover:border-[#FE2C55]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#FE2C55]/10">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {isOnSale && (
            <span className="absolute top-2 left-2 bg-[#FE2C55] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 rounded-full px-2 py-0.5">
            <Heart className="w-3 h-3 text-[#FE2C55] fill-[#FE2C55]" />
            <span className="text-white text-xs">
              {product.likes >= 1000
                ? `${(product.likes / 1000).toFixed(1)}k`
                : product.likes}
            </span>
          </div>
        </div>

        <div className="p-3">
          <h3 className="text-white text-sm font-medium line-clamp-2 leading-snug mb-1.5">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-400 text-xs">
              ({product.reviewCount.toLocaleString()})
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[#FE2C55] font-bold text-base">
                ${product.price.toFixed(2)}
              </span>
              {isOnSale && (
                <span className="text-gray-500 text-xs line-through ml-1.5">
                  ${product.originalPrice!.toFixed(2)}
                </span>
              )}
            </div>

            {showAddToCart && (
              <button
                onClick={handleAddToCart}
                className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-full transition-all duration-200 ${
                  added
                    ? "bg-green-500 text-white scale-95"
                    : "bg-[#FE2C55] text-white hover:bg-[#e6274d] active:scale-95"
                }`}
              >
                <ShoppingCart className="w-3 h-3" />
                {added ? "Added!" : "Add"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
