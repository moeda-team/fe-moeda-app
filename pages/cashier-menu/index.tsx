import { BestSellerSlider, Hero, OrderForm, SearchBar } from "@/components/sections";
import { ProductCard } from "@/components/ui";
import { mockProducts } from "@/mockProduct";
import { map } from "lodash";
import { AnimatePresence } from "motion/react";
import { useRouter } from "next/router";
import React, { useState } from "react";

const CashierMenu = () => {
  const router = useRouter();
  const [openPopupOrder, setOpenPopupOrder] = useState<boolean>(false);
  const [productDetail, setProductDetail] = useState<any>({});

  const handleSearch = (query: string) => {
    router.push(router.pathname, {
      query: {
        ...router.query,
        search: query,
      },
    });
  };

  return (
    <>
      <Hero />

      <div className="px-4 text-lg font-semibold space-y-4 w-full">
        <SearchBar onSearch={handleSearch} />
      </div>

      <BestSellerSlider onOpenPopupOrder={() => setOpenPopupOrder(true)} onSetProductDetail={setProductDetail} />

      <div className="mt-8 px-4 text-lg font-semibold space-y-4">
        <h4>Menu</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8">
          {map(mockProducts, (product, index) => (
            <ProductCard
              key={index}
              title={product.name}
              description={product.description}
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
    </>
  );
};

export default CashierMenu;
