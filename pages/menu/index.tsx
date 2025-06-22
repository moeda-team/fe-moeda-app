import {
  CategoryList,
  Hero,
  OrderForm,
  SearchBar,
} from "@/components/sections";
import { ProductCard } from "@/components/ui";
import { mockProducts } from "@/mockProduct";
import { getMenu, getMenuByCategory } from "@/swr/get/products";
import { map } from "lodash";
import { AnimatePresence } from "motion/react";
import { useRouter } from "next/router";
import React, { useState } from "react";

const Menu = () => {
  const router = useRouter();
  const { category } = router.query;
  const { errorMenusByCategory, isLoadingMenusByCategory, menusByCategory } =
    getMenuByCategory(category as string);
  const { errorMenu, isLoadingMenu, menu } = getMenu();
  const [openPopupOrder, setOpenPopupOrder] = useState<boolean>(false);
  const [productDetail, setProductDetail] = useState<any>({});

  const handleSearch = (query: string) => {
    router.push(`/menu?search=${query}`);
  };

  return (
    <>
      <Hero />

      <div className="px-4 text-lg font-semibold space-y-4 w-full">
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className="mt-8 px-4 text-lg font-semibold space-y-4">
        <h4>Menu</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8">
          {category &&
            Array.isArray(menusByCategory) &&
            menusByCategory.map((product, index) => (
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
          {!category &&
            Array.isArray(menu) &&
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
    </>
  );
};

export default Menu;
