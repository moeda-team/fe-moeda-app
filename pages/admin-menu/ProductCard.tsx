import { formatToIDR } from "@/utils/formatCurrency";
import Image from "next/image";
import React, { useState } from "react";

export default function Card({
  image,
  title,
  description,
  price,
  quantity,
}: {
  image: string;
  title: string;
  description: string;
  price?: number;
  quantity?: number;
}) {
  const [img, setImage] = useState(image);

  const isSoldOut = quantity === 0;

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-md bg-white flex flex-col h-full relative">
      {/* Image Section */}
      <div className="h-[140px] w-full relative flex-shrink-0">
        <Image
          className="p-2 rounded-t-[100px_20px] rounded-b-[100px_20px]"
          src={img}
          alt="Food"
          fill
          sizes="(min-width: 808px) 50vw, 100vw"
          style={{
            objectFit: "cover",
          }}
          priority
          onError={() => setImage("/images/product-image.webp")}
        />

        {/* Overlay Sold Out */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Sold Out
            </span>
          </div>
        )}
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
      </div>
    </div>
  );
}
