import {
  Hero,
  BestSellerSlider,
  OrderForm,
  CategoryList,
} from "@/components/sections";
import { ProductCard } from "@/components/ui";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { getMenu } from "@/swr/get/products";

export default function Home() {
  const [openPopupOrder, setOpenPopupOrder] = useState<boolean>(false);
  const [productDetail, setProductDetail] = useState<any>({});
  const { errorMenu, isLoadingMenu, menu } = getMenu();

  return (
    <div className="bg-neutral-50 min-h-screen">
      <Hero />

      <BestSellerSlider
        onOpenPopupOrder={() => setOpenPopupOrder(true)}
        onSetProductDetail={setProductDetail}
      />

      <div className="mt-8 px-4 text-lg font-semibold space-y-4">
        <h4>Menu</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 pb-8">
          {Array.isArray(menu) &&
            menu.map((product, index) => (
              <ProductCard
                key={index}
                title={product.name}
                description={product.desc}
                image={product.img}
                onAddToCart={() => {
                  setOpenPopupOrder(true);
                  setProductDetail(product);
                }}
              />
            ))}
        </div>
      </div>

      <div className="mt-8 px-4 text-lg font-semibold space-y-4">
        <AnimatePresence>
          {openPopupOrder && (
            <OrderForm
              productDetail={productDetail}
              onClose={() => {
                setOpenPopupOrder(false);
                setProductDetail({});
              }}
              isOpen={openPopupOrder}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
