import { BestSellerCard } from "@/components/ui";
import { useMenu } from "@/swr/get/products";

interface BestSellerSliderProps {
  onOpenPopupOrder: () => void;
  onSetProductDetail: (product: any) => void;
}

export default function BestSellerSlider({ onOpenPopupOrder, onSetProductDetail }: BestSellerSliderProps) {
  const { errorMenu, isLoadingMenu, menu } = useMenu({
    search: "",
    category: "",
    best: "true",
  });

  if (errorMenu) {
    return null;
  }

  return (
    <div className="px-4 text-lg font-semibold space-y-4">
      <h4>Best Seller</h4>
      <div className="w-full overflow-x-auto cursor-grab no-scrollbar">
        <div className="flex w-max space-x-4">
          {Array.isArray(menu) &&
            menu.map((menu, index) => (
              <BestSellerCard
                key={index}
                onOpenPopupOrder={onOpenPopupOrder}
                onSetProductDetail={() => onSetProductDetail(menu)}
                image={menu.img}
                title={menu.name}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
