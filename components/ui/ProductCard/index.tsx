// /components/ui/Card/index.tsx
import { formatToIDR } from "@/utils/formatCurrency";
import Image from "next/image";
import React from "react";

export default function Card({
  onAddToCart,
  image,
  title,
  description,
  price,
}: {
  onAddToCart?: () => void;
  image: string;
  title: string;
  description: string;
  price?: number;
}) {
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-md bg-white flex flex-col h-full">
      {/* Image Section */}
      <div className="h-[140px] w-full relative flex-shrink-0">
        <Image
          className="p-2 rounded-t-[100px_20px] rounded-b-[100px_20px]"
          src={image}
          alt="Food"
          fill
          sizes="(min-width: 808px) 50vw, 100vw"
          style={{
            objectFit: "cover",
          }}
          priority
        />
      </div>

      {/* Content Section */}
      <div className="p-2 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
            {title}
          </h3>
          <p className="text-xs text-neutral-400 mt-1 font-normal line-clamp-2">
            {description}
          </p>
          {price && <p>{formatToIDR(price)}</p>}
        </div>

        {/* Button - Always at bottom */}
        <button
          className="mt-4 w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-800 text-white text-sm font-semibold py-1 rounded-full flex-shrink-0"
          onClick={onAddToCart}
        >
          <span className="text-lg">+</span>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
