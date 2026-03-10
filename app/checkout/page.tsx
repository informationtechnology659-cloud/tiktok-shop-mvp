"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CheckCircle2, ShoppingBag, ArrowLeft, Lock } from "lucide-react";

interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const initialForm: ShippingForm = {
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
};

const SHIPPING_COST = 4.99;
const SHIPPING_THRESHOLD = 50;

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [form, setForm] = useState<ShippingForm>(initialForm);
  const [errors, setErrors] = useState<Partial<ShippingForm>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const shipping = totalPrice >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = totalPrice + shipping;

  const validate = (): boolean => {
    const newErrors: Partial<ShippingForm> = {};
    if (!form.firstName.trim()) newErrors.firstName = "Required";
    if (!form.lastName.trim()) newErrors.lastName = "Required";
    if (!form.email.trim()) newErrors.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email";
    if (!form.address.trim()) newErrors.address = "Required";
    if (!form.city.trim()) newErrors.city = "Required";
    if (!form.state.trim()) newErrors.state = "Required";
    if (!form.zip.trim()) newErrors.zip = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    clearCart();
    setSubmitted(true);
    setLoading(false);
  };

  const handleChange = (field: keyof ShippingForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  if (submitted) {
    return (
      <div className="pt-14 min-h-screen bg-[#121212] flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center animate-slide-up">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-white font-bold text-2xl mb-3">Order Placed! 🎉</h1>
          <p className="text-gray-400 text-sm mb-2">
            Thank you, {form.firstName}! Your order has been confirmed.
          </p>
          <p className="text-gray-500 text-xs mb-8">
            A confirmation has been sent to {form.email}
          </p>
          <div className="bg-[#1a1a1a] rounded-xl p-4 mb-8 border border-white/10 text-left">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Order Total</span>
              <span className="text-[#FE2C55] font-bold">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Estimated Delivery</span>
              <span className="text-white">3-5 business days</span>
            </div>
          </div>
          <Link href="/shop">
            <button className="w-full bg-[#FE2C55] text-white font-bold py-3.5 rounded-xl hover:bg-[#e6274d] transition-colors">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-14 min-h-screen bg-[#121212] flex flex-col items-center justify-center px-4">
        <ShoppingBag className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-white font-bold text-xl mb-2">Nothing to checkout</h2>
        <Link href="/shop">
          <button className="mt-4 bg-[#FE2C55] text-white font-bold px-8 py-3 rounded-xl">
            Go Shopping
          </button>
        </Link>
      </div>
    );
  }

  const inputClass = (field: keyof ShippingForm) =>
    `w-full bg-[#1a1a1a] text-white text-sm px-4 py-2.5 rounded-xl border outline-none transition-colors placeholder-gray-600 ${
      errors[field]
        ? "border-red-500 focus:border-red-500"
        : "border-white/10 focus:border-[#FE2C55]"
    }`;

  return (
    <div className="pt-14 min-h-screen bg-[#121212]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/cart">
            <button className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Checkout</h1>
            <p className="text-gray-400 text-sm">{totalItems} items</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Shipping form */}
            <div className="lg:col-span-2">
              <div className="bg-[#1a1a1a] rounded-xl p-5 border border-white/5">
                <h2 className="text-white font-bold text-base mb-5 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#FE2C55]" />
                  Shipping Information
                </h2>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">First Name</label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={handleChange("firstName")}
                      placeholder="John"
                      className={inputClass("firstName")}
                    />
                    {errors.firstName && (
                      <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Last Name</label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={handleChange("lastName")}
                      placeholder="Doe"
                      className={inputClass("lastName")}
                    />
                    {errors.lastName && (
                      <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="text-gray-400 text-xs mb-1 block">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    placeholder="john@example.com"
                    className={inputClass("email")}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="mb-3">
                  <label className="text-gray-400 text-xs mb-1 block">Street Address</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={handleChange("address")}
                    placeholder="123 Main Street, Apt 4B"
                    className={inputClass("address")}
                  />
                  {errors.address && (
                    <p className="text-red-400 text-xs mt-1">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">City</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={handleChange("city")}
                      placeholder="New York"
                      className={inputClass("city")}
                    />
                    {errors.city && (
                      <p className="text-red-400 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">State</label>
                    <input
                      type="text"
                      value={form.state}
                      onChange={handleChange("state")}
                      placeholder="NY"
                      className={inputClass("state")}
                    />
                    {errors.state && (
                      <p className="text-red-400 text-xs mt-1">{errors.state}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">ZIP Code</label>
                    <input
                      type="text"
                      value={form.zip}
                      onChange={handleChange("zip")}
                      placeholder="10001"
                      className={inputClass("zip")}
                    />
                    {errors.zip && (
                      <p className="text-red-400 text-xs mt-1">{errors.zip}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Country</label>
                    <select
                      value={form.country}
                      onChange={handleChange("country")}
                      className="w-full bg-[#1a1a1a] text-white text-sm px-4 py-2.5 rounded-xl border border-white/10 focus:border-[#FE2C55] outline-none transition-colors"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#1a1a1a] rounded-xl p-5 border border-white/5 sticky top-20">
                <h2 className="text-white font-bold text-base mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4 max-h-52 overflow-y-auto pr-1">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                        <span className="absolute -top-1 -right-1 bg-[#FE2C55] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                          {quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-[#FE2C55] text-xs font-bold">
                          ${(product.price * quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span className={shipping === 0 ? "text-green-400" : "text-white"}>
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 flex justify-between mb-5">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-[#FE2C55] font-bold text-xl">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FE2C55] text-white font-bold py-3.5 rounded-xl hover:bg-[#e6274d] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Place Order
                    </>
                  )}
                </button>

                <p className="text-center text-gray-500 text-xs mt-3">
                  🔒 256-bit SSL encryption
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
