import React, { useEffect } from 'react'

const useTriggerLS = (setCartProducts:any) => {
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
}

export default useTriggerLS
