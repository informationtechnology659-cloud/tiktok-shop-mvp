"use client";

import { useEffect, useRef, useState } from "react";
import VideoCard from "@/components/VideoCard";
import { products } from "@/lib/products";
import { ChevronDown } from "lucide-react";

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const feedProducts = products.slice(0, 8);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const itemHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / itemHeight);
      setActiveIndex(newIndex);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="snap-container fixed inset-0 pt-14"
      style={{ scrollSnapType: "y mandatory", overflowY: "scroll" }}
    >
      {feedProducts.map((product, index) => (
        <div
          key={product.id}
          className="snap-item relative w-full"
          style={{ height: "calc(100dvh - 56px)", scrollSnapAlign: "start", scrollSnapStop: "always" }}
        >
          <VideoCard product={product} isActive={index === activeIndex} />

          {index < feedProducts.length - 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce pointer-events-none z-10">
              <ChevronDown className="w-5 h-5 text-white/50" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
