// components/hero/index.tsx
import Image from "next/image";
import { CategoryList } from "@/components/sections";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { FiMoreVertical, FiShoppingCart } from "react-icons/fi";
import { useRouter } from "next/router";
import useTriggerLS from "@/hooks/useTriggerLS";
import useOutsideClick from "@/hooks/useOutsideClick";
import { parseCookies, destroyCookie } from "nookies";

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
  const [openLogout, setOpenLogout] = useState(false);
  const ref = useOutsideClick({
    callback: () => setOpenLogout(false),
  });

  const isShowLogout = useMemo(() => {
    let isBlockedPath = ["/payment", "/bill-note", "/order-detail"].includes(
      router.pathname
    );
    return !isBlockedPath && !isCustomer;
  }, [isCustomer, router.pathname]);

  // Calculate total quantity of items in cart
  const totalCartItems = cartProducts.length;
  const onLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    const allCookies = parseCookies();
    Object.keys(allCookies).forEach((cookieName) => {
      destroyCookie(null, cookieName, { path: "/" });
    });

    setOpenLogout(false);

    router.push("/");
  };

  useTriggerLS(setCartProducts);

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
        {isShowLogout && (
          <div
            ref={ref}
            className="flex gap-2 relative"
            onClick={() => setOpenLogout((prev) => !prev)}
          >
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-full p-3 shadow-lg relative"
              onClick={() => router.push("/cart")}
            >
              <FiMoreVertical className="w-5 h-5 text-gray-700" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-danger-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </motion.div>
            {openLogout && (
              <div
                onClick={onLogout}
                className="absolute z-50 bg-red-500 p-3 rounded -translate-x-10 translate-y-12 hover:bg-red-200 text-white cursor-pointer"
              >
                Keluar
              </div>
            )}
          </div>
        )}
      </div>

      {isCustomer && <CategoryList />}
    </>
  );
}
