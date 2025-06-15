import { BestSellerCard } from "@/components/ui";
import { getBestSeller } from "@/swr/get/bestSeller";

interface BestSellerSliderProps {
  onOpenPopupOrder: () => void;
  onSetProductDetail: (product: any) => void;
}

export default function BestSellerSlider({
  onOpenPopupOrder,
  onSetProductDetail,
}: BestSellerSliderProps) {
  const { bestSeller } = getBestSeller();

  return (
    <div className="w-full overflow-x-auto cursor-grab no-scrollbar">
      <div className="flex w-max space-x-4">
        {Array.isArray(bestSeller) &&
          bestSeller.map((bestSell, index) => (
            <BestSellerCard
              key={index}
              onOpenPopupOrder={onOpenPopupOrder}
              onSetProductDetail={() => onSetProductDetail(bestSell)}
              image={bestSell.img}
              title={bestSell.name}
            />
          ))}
      </div>
    </div>
  );
}
