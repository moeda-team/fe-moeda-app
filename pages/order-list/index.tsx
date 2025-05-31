import { Hero } from "@/components/sections";
import ConfirmationPopup from "@/components/ui/ConfirmOrderPopup";
import OrderCard from "@/components/ui/OrderListCard";
import { useState } from "react";

interface OrderProduct {
  productId: string;
  productName: string;
  type: "hot" | "iced";
  size: "regular" | "large";
  iceCube: "regular" | "less" | "more";
  sweet: "regular" | "less";
  note?: string;
  quantity: number;
  basePrice?: number;
  imageUrl: string;
  status: "preparing" | "ready" | "completed" | "cancelled";
}

export default function OrderTable() {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderProduct | null>(null);

  // Sample order data
  const orders: OrderProduct[] = [
    {
      productId: "1",
      productName: "Matcha Latte",
      imageUrl: "/images/card-menu.png",
      type: "iced",
      size: "regular",
      iceCube: "more",
      sweet: "less",
      note: "no sugar please",
      quantity: 2,
      status: "ready",
    },
    {
      productId: "2",
      productName: "Caramel Macchiato",
      imageUrl: "/images/card-menu.png",
      type: "hot",
      size: "large",
      iceCube: "less",
      sweet: "regular",
      note: "extra caramel",
      quantity: 1,
      status: "preparing",
    },
    {
      productId: "3",
      productName: "Vanilla Cold Brew",
      imageUrl: "/images/card-menu.png",
      type: "iced",
      size: "large",
      iceCube: "regular",
      sweet: "less",
      note: "light ice",
      quantity: 3,
      status: "completed",
    },
    {
      productId: "4",
      productName: "Spicy Tofu Wrap",
      imageUrl: "/images/card-menu.png",
      type: "hot",
      size: "regular",
      iceCube: "less",
      sweet: "regular",
      note: "cut in half",
      quantity: 1,
      status: "cancelled",
    },
    {
      productId: "5",
      productName: "Mango Smoothie",
      imageUrl: "/images/card-menu.png",
      type: "iced",
      size: "large",
      iceCube: "more",
      sweet: "less",
      note: "no straw",
      quantity: 2,
      status: "ready",
    },
    {
      productId: "6",
      productName: "Black Bean Burrito, Indian Style",
      imageUrl: "/images/card-menu.png",
      type: "hot",
      size: "large",
      iceCube: "regular",
      sweet: "regular",
      note: "extra spicy",
      quantity: 1,
      status: "preparing",
    },
  ];

  const onActionOrder = async (order: OrderProduct): Promise<void> => {
    setSelectedOrder(order);
    setShowPopup(true);

    try {
      let response;

      switch (order.status) {
        case "preparing":
          response = await fetch(`/api/orders/${order.productId}/prepare`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order),
          });
          break;
        case "ready":
          response = await fetch(`/api/orders/${order.productId}/ready`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order),
          });
          break;
        case "completed":
          response = await fetch(`/api/orders/${order.productId}/complete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order),
          });
          break;
        case "cancelled":
          response = await fetch(`/api/orders/${order.productId}/cancel`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order),
          });
          break;
        default:
          console.warn("Unknown status:", order.status);
          return;
      }

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API response:", data);
    } catch (error) {
      console.error("Error handling order action:", error);
    }
  };

  const handleConfirm = (): void => {
    // Handle order completion logic here
    if (selectedOrder) {
      console.log(`Order ${selectedOrder.productId} confirmed as completed`);
    }
    setShowPopup(false);
    setSelectedOrder(null);
  };

  const handleCancel = (): void => {
    setShowPopup(false);
    setSelectedOrder(null);
  };

  return (
    <div className="bg-neutral-50">
      <Hero isCustomer={false} />
      <div className="min-h-screen p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
            ORDER TABLE 01
          </h1>
          <div className="w-full h-0.5 bg-neutral-300 mt-4"></div>
        </div>

        {/* Order Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {orders.map((order: OrderProduct, index: number) => (
            <OrderCard
              key={order.productId}
              order={order}
              index={index}
              onActionOrder={onActionOrder}
            />
          ))}
        </div>

        {/* Confirmation Popup */}
        <ConfirmationPopup
          isOpen={showPopup}
          selectedOrder={selectedOrder}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
