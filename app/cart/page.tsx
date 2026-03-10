"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag } from "lucide-react";

const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 4.99;

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  const shipping = totalPrice >= SHIPPING_THRESHOLD || totalPrice === 0 ? 0 : SHIPPING_COST;
  const total = totalPrice + shipping;

  if (items.length === 0) {
    return (
      <div className="pt-14 min-h-screen bg-[#121212] flex flex-col items-center justify-center px-4">
        <ShoppingBag className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-white font-bold text-xl mb-2">Your cart is empty</h2>
        <p className="text-gray-400 text-sm mb-8 text-center">
          Discover trending products and add them to your cart
        </p>
        <Link
          href="/shop"
          className="bg-[#FE2C55] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#e6274d] transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-14 min-h-screen bg-[#121212]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">My Cart</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {totalItems} item{totalItems !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="bg-[#1a1a1a] rounded-xl p-4 flex gap-4 border border-white/5 animate-slide-up"
              >
                <Link href={`/product/${product.id}`} className="flex-shrink-0">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-white text-sm font-semibold line-clamp-2 hover:text-[#FE2C55] transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-gray-400 text-xs mt-0.5">{product.category}</p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-0 bg-[#121212] rounded-lg border border-white/10 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center text-white text-sm font-semibold">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[#FE2C55] font-bold text-base">
                        ${(product.price * quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1a1a] rounded-xl p-5 border border-white/5 sticky top-20">
              <h2 className="text-white font-bold text-lg mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal ({totalItems} items)</span>
                  <span className="text-white">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className={shipping === 0 ? "text-green-400" : "text-white"}>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {totalPrice < SHIPPING_THRESHOLD && totalPrice > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-white/5 rounded-lg p-2">
                    <Tag className="w-3 h-3" />
                    Add ${(SHIPPING_THRESHOLD - totalPrice).toFixed(2)} more for free shipping
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-4 mb-5">
                <div className="flex justify-between">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-[#FE2C55] font-bold text-xl">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <Link href="/checkout">
                <button className="w-full bg-[#FE2C55] text-white font-bold py-3.5 rounded-xl hover:bg-[#e6274d] transition-colors flex items-center justify-center gap-2">
                  Proceed to Checkout
                </button>
              </Link>

              <div className="mt-4 text-center">
                <p className="text-gray-500 text-xs">
                  🔒 Secure checkout · Free returns
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
