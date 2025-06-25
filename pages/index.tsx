import {
  Hero,
  BestSellerSlider,
  OrderForm,
  SearchBar,
} from "@/components/sections";
import { ProductCard } from "@/components/ui";
import { AnimatePresence } from "motion/react";
import { use, useEffect, useState } from "react";
import { getMenu } from "@/swr/get/products";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { category, search } = router.query;
  const [openPopupOrder, setOpenPopupOrder] = useState<boolean>(false);
  const [productDetail, setProductDetail] = useState<any>({});
  const { menu, mutate } = getMenu({
    search: search as string,
    category: category as string,
    best: "",
  });

  const handleSearch = (search: string) => {
    router.push({
      pathname: router.pathname,
      query: {
        search: search,
      },
    });
  };

  return (
    <div className="bg-neutral-50 min-h-screen">
      <Hero />

      <BestSellerSlider
        onOpenPopupOrder={() => setOpenPopupOrder(true)}
        onSetProductDetail={setProductDetail}
      />
      <div className="mt-8 px-4 text-lg font-semibold space-y-4">
        <SearchBar onSearch={handleSearch} />
      </div>
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
