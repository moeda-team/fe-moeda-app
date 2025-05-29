// BestSellerSlider.tsx
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { BestSellerCard } from "@/components/ui"; // adjust path accordingly
import { mockProducts } from "@/mockProduct";

interface BestSellerSliderProps {
  onOpenPopupOrder: () => void;
  onSetProductDetail: (product: any) => void;
}

export default function BestSellerSlider({
  onOpenPopupOrder,
  onSetProductDetail,
}: BestSellerSliderProps) {
  const [bestSeller, setBestSeller] = useState(mockProducts);

  return (
    <div className="w-full overflow-x-auto cursor-grab no-scrollbar">
      <div className="flex w-max space-x-4">
        {bestSeller.map((bestSell, index) => (
          <BestSellerCard
            key={index}
            onOpenPopupOrder={onOpenPopupOrder}
            onSetProductDetail={() => onSetProductDetail(bestSell)}
            image={bestSell.imageUrl}
            title={bestSell.productName}
          />
        ))}
      </div>
    </div>
  );
}
