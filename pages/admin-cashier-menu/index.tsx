import { AdminLayout } from "@/components/layout";
import { CategoryList, OrderForm, SearchBar } from "@/components/sections";
import { CartCard, ProductCard } from "@/components/ui";
import { mockProducts } from "@/mockProduct";
import { AnimatePresence } from "motion/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HiChevronDown } from "react-icons/hi";
import { FiShoppingCart } from "react-icons/fi";
import { formatToIDR } from "@/utils/formatCurrency";
import { IoCard } from "react-icons/io5";
import _ from "lodash";
import { getMenu, getMenuByCategory } from "@/swr/get/products";

const tables = ["Table 1", "Table 2", "Table 3", "Table 4", "Table 5"];

// Types
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

const AdminCashierMenu = () => {
  const router = useRouter();
  const { category } = router.query;
  const { errorMenusByCategory, isLoadingMenusByCategory, menusByCategory } =
    getMenuByCategory(category as string);
  const { errorMenu, isLoadingMenu, menu } = getMenu();
  const [openPopupOrder, setOpenPopupOrder] = useState<boolean>(false);
  const [productDetail, setProductDetail] = useState<any>({});
  const [customerName, setCustomerName] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [isTableDropdownOpen, setIsTableDropdownOpen] = useState(false);
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);

  const subTotal = _.sumBy(
    cartProducts,
    (product) => product.price * product.quantity
  );
  const totalAmount = subTotal;

  // Remove product by matching all properties and update localStorage
  const removeProduct = (productToRemove: CartProduct) => {
    const updatedProducts = cartProducts.filter((product) => {
      return !(
        product.price === productToRemove.price &&
        product.iceCube === productToRemove.iceCube &&
        product.img === productToRemove.img &&
        product.note === productToRemove.note &&
        product.id === productToRemove.id &&
        product.quantity === productToRemove.quantity &&
        product.size === productToRemove.size &&
        product.sweet === productToRemove.sweet &&
        product.type === productToRemove.type &&
        product.spicyLevel === productToRemove.spicyLevel &&
        product.addOns === productToRemove.addOns
      );
    });
    setCartProducts(updatedProducts);
    localStorage.setItem("cart", JSON.stringify(updatedProducts));
  };

  // Update quantity and localStorage
  const updateQuantity = (
    productToUpdate: CartProduct,
    newQuantity: number
  ) => {
    if (newQuantity <= 0) {
      removeProduct(productToUpdate);
      return;
    }
    const updatedProducts = cartProducts.map((product) => {
      // Match by all properties to find the exact product
      if (
        product.price === productToUpdate.price &&
        product.iceCube === productToUpdate.iceCube &&
        product.img === productToUpdate.img &&
        product.note === productToUpdate.note &&
        product.id === productToUpdate.id &&
        product.quantity === productToUpdate.quantity &&
        product.size === productToUpdate.size &&
        product.sweet === productToUpdate.sweet &&
        product.type === productToUpdate.type
      ) {
        return { ...product, quantity: newQuantity };
      }
      return product;
    });
    setCartProducts(updatedProducts);
    localStorage.setItem("cart", JSON.stringify(updatedProducts));
  };

  const handleSearch = (query: string) => {
    router.push(`/admin-cashier-menu?search=${query}`);
  };

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
    <AdminLayout isHome={true}>
      <div className="grid grid-cols-9 gap-4">
        {/* Left Side - Scrollable */}
        <div
          className="col-span-6 overflow-y-auto no-scrollbar"
          style={{ height: "calc(100vh - 160px)" }}
        >
          <div className="text-lg font-semibold space-y-4">
            <h4>Categories</h4>
            <CategoryList />
          </div>

          <div className="py-4">
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="text-lg font-semibold space-y-4">
            <h4>Menu</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
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
        </div>

        {/* Right Side - Sticky */}
        <div className="col-span-3 flex flex-col sticky top-20 self-start">
          {/* Cart Items - Scrollable */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <div
              className="p-4 pb-10 overflow-y-auto pt-0"
              style={{ height: "calc(88vh - 160px)" }}
            >
              <div className="text-base space-y-4 p-4 bg-white mb-4">
                <h4 className="font-semibold">Customer Information</h4>
                {/* Customer Name Input */}
                <div>
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Table Selection Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsTableDropdownOpen(!isTableDropdownOpen)}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 flex items-center justify-between text-left"
                  >
                    <span
                      className={
                        selectedTable ? "text-neutral-800" : "text-neutral-400"
                      }
                    >
                      {selectedTable || "Select Table"}
                    </span>
                    <HiChevronDown
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isTableDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isTableDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full mt-1 w-full bg-white border border-neutral-200 rounded-lg shadow-lg z-20"
                      >
                        {tables.map((table) => (
                          <button
                            key={table}
                            onClick={() => {
                              setSelectedTable(table);
                              setIsTableDropdownOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-neutral-50 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
                          >
                            {table}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <AnimatePresence>
                {cartProducts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-8 text-center"
                  >
                    <FiShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-400">
                      Add some delicious matcha lattes to get started!
                    </p>
                  </motion.div>
                ) : (
                  cartProducts.map((product, index) => (
                    <CartCard
                      index={index}
                      product={product}
                      key={product.id}
                      removeProduct={removeProduct}
                      updateQuantity={updateQuantity}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sticky Payment Section */}
          <div className="sticky bottom-0 p-4 bg-white border-t shadow-lg">
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex justify-between pb-2">
                <span className="font-bold text-lg">Amount</span>
                <span className="font-bold text-lg">
                  {formatToIDR(totalAmount)}
                </span>
              </div>
              <motion.button
                disabled={cartProducts.length === 0}
                className="w-full bg-primary-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center space-x-2 disabled:bg-neutral-400"
                whileHover={{ scale: 1.02, backgroundColor: "#225049" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400 }}
                type="button"
                onClick={() => {
                  router.push("/order-detail");
                }}
              >
                <IoCard className="w-5 h-5" />
                <span>Payment Now</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCashierMenu;
