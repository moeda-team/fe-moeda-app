// components/hero/index.tsx
import Image from "next/image";
import { CategoryList } from "@/components/sections";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useRouter } from "next/router";
import { RiFileList3Line } from "react-icons/ri";

interface CartProduct {
  name: string;
  id: string;
  type: "Hot" | "Ice";
  size: "Regular" | "Large";
  iceCube: "Less" | "Normal" | "More Ice" | "No Ice Cube";
  sweet: "Normal" | "Less Sugar";
  addOns: "Extra Cheese" | "Fried Egg" | "Crackers";
  spicyLevel: "Mild" | "Medium" | "Hot";
  note?: string;
  quantity: number;
  price: number;
  img: string;
}

interface HeroProps {
  isCustomer?: boolean;
}

export default function Hero({ isCustomer = true }: HeroProps) {
  const router = useRouter();
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);

  // Calculate total quantity of items in cart
  const totalCartItems = cartProducts.length;

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
      <div className="w-full bg-primary-500 py-6 px-4 flex items-center justify-end h-[92px]">
        <div className="text-white font-semibold text-xl ml-4 md:ml-0 absolute text-center w-full right-0">
          <div className="flex flex-col items-center justify-center">
            <Image
              onClick={() => router.push("/")}
              src="/logo.png"
              alt="Moeda Coffee Logo"
              width={44}
              height={44}
              className="object-contain relative z-50"
              priority
            />
            <span>MOEDA COFFEE</span>
          </div>
        </div>
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
          </div>
        )}
      </div>

      {isCustomer && <CategoryList />}
    </>
  );
}
