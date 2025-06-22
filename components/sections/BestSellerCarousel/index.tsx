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
  const { bestSeller, errorBestSeller } = getBestSeller();

  if (errorBestSeller) {
    return null;
  }

  return (
    <div className="px-4 text-lg font-semibold space-y-4 mt-8">
      <h4>Best Seller</h4>
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
    </div>
  );
}
