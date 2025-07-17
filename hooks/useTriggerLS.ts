import React, { useEffect } from "react";
import { Dispatch, SetStateAction } from "react";

type CartProduct = any; // Replace 'any' with your actual cart product type

const useTriggerLS = (setCartProducts: Dispatch<SetStateAction<CartProduct[]>>) => {
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
  }, [setCartProducts]);

  // Optional: Add a way to manually trigger a cart update
  const triggerCartUpdate = () => {
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return { triggerCartUpdate };
};

export default useTriggerLS;
