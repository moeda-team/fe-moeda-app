// BestSellerSlider.tsx
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { BestSellerCard } from "@/components/ui"; // adjust path accordingly
import { mockProducts } from "@/mockProduct";

interface BestSellerSliderProps {
  onOpenPopupOrder: () => void;
  onSetProductDetail: (product: any) => void;
}

const cardData = [
  { image: "123", title: "123" },
  { image: "456", title: "456" },
  { image: "789", title: "789" },
  { image: "101", title: "101" },
];

export default function BestSellerSlider({
  onOpenPopupOrder,
  onSetProductDetail,
}: BestSellerSliderProps) {
  const [bestSeller, setBestSeller] = useState(mockProducts);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  console.log({ bestSeller });

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      setWidth(carousel.scrollWidth - carousel.offsetWidth);
    }
  }, []);

  return (
    <div className="overflow-hidden cursor-grab">
      <motion.div
        ref={carouselRef}
        className="flex"
        drag="x"
        dragConstraints={{ right: 0, left: -width }}
        whileTap={{ cursor: "grabbing" }}
      >
        {bestSeller.map((bestSell, index) => (
          <motion.div key={index} className="min-w-[200px]">
            <BestSellerCard
              onOpenPopupOrder={onOpenPopupOrder}
              onSetProductDetail={() => onSetProductDetail(bestSell)}
              image={bestSell.imageUrl}
              title={bestSell.productName}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
