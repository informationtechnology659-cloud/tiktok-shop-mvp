"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById, getRelatedProducts } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import {
  Star,
  Heart,
  ShoppingCart,
  Zap,
  ArrowLeft,
  Minus,
  Plus,
  Share2,
} from "lucide-react";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = getProductById(Number(id));

  if (!product) notFound();

  const related = getRelatedProducts(product);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const isOnSale = !!product.originalPrice;
  const discount = isOnSale
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100
      )
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="pt-14 min-h-screen bg-[#121212]">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Back button */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        {/* Product detail grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#1a1a1a]">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              {isOnSale && (
                <span className="absolute top-4 left-4 bg-[#FE2C55] text-white font-bold text-sm px-3 py-1 rounded-full">
                  -{discount}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <span className="text-[#FE2C55] text-xs font-semibold uppercase tracking-wider">
                  {product.category}
                </span>
                <h1 className="text-white font-bold text-2xl leading-tight mt-1">
                  {product.name}
                </h1>
              </div>
              <button
                onClick={() => setLiked(!liked)}
                className={`flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                  liked
                    ? "border-[#FE2C55] bg-[#FE2C55]/10"
                    : "border-white/20 bg-white/5"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${
                    liked ? "text-[#FE2C55] fill-[#FE2C55]" : "text-gray-400"
                  }`}
                />
              </button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-yellow-400 font-semibold text-sm">
                {product.rating}
              </span>
              <span className="text-gray-400 text-sm">
                ({product.reviewCount.toLocaleString()} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-[#FE2C55] font-bold text-3xl">
                ${product.price.toFixed(2)}
              </span>
              {isOnSale && (
                <span className="text-gray-500 text-lg line-through">
                  ${product.originalPrice!.toFixed(2)}
                </span>
              )}
              {isOnSale && (
                <span className="bg-[#FE2C55]/20 text-[#FE2C55] text-xs font-bold px-2 py-1 rounded-md">
                  Save ${(product.originalPrice! - product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Tags */}
            {product.tags && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-gray-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-white text-sm font-medium">Quantity</span>
              <div className="flex items-center gap-0 bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-white font-semibold text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition-all ${
                  addedToCart
                    ? "bg-green-500 text-white"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {addedToCart ? "Added to Cart!" : "Add to Cart"}
              </button>

              <Link href="/cart" className="flex-1">
                <button
                  onClick={() => { addToCart(product, quantity); }}
                  className="w-full flex items-center justify-center gap-2 bg-[#FE2C55] text-white font-bold py-3 rounded-xl hover:bg-[#e6274d] transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  Buy Now
                </button>
              </Link>

              <button className="w-12 h-12 flex items-center justify-center bg-[#1a1a1a] text-gray-400 hover:text-white rounded-xl border border-white/10 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-white font-bold text-xl mb-4">
              Related Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
