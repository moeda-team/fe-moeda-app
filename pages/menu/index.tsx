import { Hero, OrderForm, SearchBar } from "@/components/sections";
import { ProductCard } from "@/components/ui";
import { mockProducts } from "@/mockProduct";
import { map } from "lodash";
import { AnimatePresence } from "motion/react";
import { useRouter } from "next/router";
import React, { useState } from "react";

const Menu = () => {
  const router = useRouter();
  const [openPopupOrder, setOpenPopupOrder] = useState<boolean>(false);
  const [productDetail, setProductDetailt] = useState<any>({});

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    router.push(`/menu?search=${query}`);
  };

  return (
    <>
      <Hero />

      <div className="mt-20 px-4 text-lg font-semibold space-y-4 w-full">
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className="mt-8 px-4 text-lg font-semibold space-y-4">
        <h4>Menu</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8">
          {map(mockProducts, (product, index) => (
            <ProductCard
              key={index}
              title={product.productName}
              description={product.description}
              image={product.imageUrl}
              onAddToCart={() => {
                setOpenPopupOrder(true);
                setProductDetailt(product);
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
              onClose={() => setOpenPopupOrder(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Menu;
