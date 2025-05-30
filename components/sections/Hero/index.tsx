// components/hero/index.tsx
import Image from "next/image";
import { CategoryList } from "@/components/sections";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useRouter } from "next/router";
import { RiFileList3Line } from "react-icons/ri";

interface CartProduct {
  productId: string;
  type: "hot" | "iced";
  size: "regular" | "large";
  iceCube: "regular" | "less" | "more";
  sweet: "regular" | "less";
  note?: string;
  quantity: number;
  basePrice: number;
  imageUrl: string;
}

interface HeroProps {
  isCustomer?: boolean;
}

export default function Hero({ isCustomer = true }: HeroProps) {
  const router = useRouter();
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);

  // Calculate total quantity of items in cart
  const totalCartItems = cartProducts.reduce(
    (total, product) => total + product.quantity,
    0
  );

  useEffect(() => {
    const loadCart = () => {
      const cart = localStorage.getItem("cart");
      setCartProducts(cart ? JSON.parse(cart) : []);
    };

    loadCart();

    // Listen for changes in other tabs
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "cart") {
        loadCart();
      }
    };

    // Listen for custom cart update events (same tab)
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  return (
    <>
      <div className="w-full bg-primary-500 py-6 px-4 flex items-center justify-between rounded-b-3xl">
        <Image
          onClick={() => router.push("/")}
          src="/logo.png"
          alt="Moeda Coffee Logo"
          width={44}
          height={44}
          className="object-contain relative z-50"
          fetchPriority="low"
        />
        <p className="text-white font-semibold text-xl ml-4 md:ml-0 absolute text-center w-full right-0">
          MOEDA COFFEE
        </p>
        {isCustomer && (
          <div className="flex gap-2">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-full p-3 shadow-lg relative"
              onClick={() => router.push("/cart")}
            >
              <FiShoppingCart className="w-5 h-5 text-gray-700" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-danger-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-full p-3 shadow-lg relative"
              onClick={() => router.push("/order")}
            >
              <RiFileList3Line className="w-5 h-5 text-gray-700" />
            </motion.div>
          </div>
        )}
      </div>

      {isCustomer && <CategoryList />}
    </>
  );
}
