// /components/ui/Card/index.tsx
import Image from "next/image";
import React from "react";

export default function Card({
  onAddToCart,
  image,
  title,
  description,
}: {
  onAddToCart?: () => void;
  image: string;
  title: string;
  description: string;
}) {
  return (
    <div className="w-full rounded-xl overflow-hidden shadow-md border border-gray-200">
      {/* Image Section */}
      <div className="h-[140px] w-full relative">
        <Image
          className="p-2 rounded-[32px]"
          src={image}
          alt="Food"
          fill
          sizes="(min-width: 808px) 50vw, 100vw"
          style={{
            objectFit: "cover",
          }}
          fetchPriority="low"
        />
      </div>

      {/* Content Section */}
      <div className="p-2">
        <h3 className="text-sm font-semibold text-gray-900 truncate">
          {title}
        </h3>
        <p className="text-xs text-neutral-400 mt-1 truncate font-normal">
          {description}
        </p>

        {/* Button */}
        <button
          className="mt-4 w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-800 text-white text-sm font-semibold py-1 rounded-full"
          onClick={onAddToCart}
        >
          <span className="text-lg">+</span>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
