import { Hero } from "@/components/sections";
import ConfirmationPopup from "@/components/ui/ConfirmOrderPopup";
import OrderCard from "@/components/ui/OrderListCard";
import { useState } from "react";

interface OrderProduct {
  id: string;
  name: string;
  type: "Hot" | "Ice";
  size: "Regular" | "Large";
  iceCube: "Less" | "Normal" | "More Ice" | "No Ice Cube";
  sweet: "Normal" | "Less Sugar";
  addOns: "Extra Cheese" | "Fried Egg" | "Crackers";
  spicyLevel: "Mild" | "Medium" | "Hot";
  note?: string;
  quantity: number;
  price?: number;
  img: string;
  status: "preparing" | "ready" | "completed" | "cancelled";
}

export default function OrderTable() {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderProduct | null>(null);

  // Sample order data
  const orders: OrderProduct[] = [
    {
      id: "1",
      name: "Cappuccino",
      type: "Hot",
      size: "Regular",
      iceCube: "Less",
      sweet: "Normal",
      addOns: "Extra Cheese",
      spicyLevel: "Mild",
      note: "No sugar",
      quantity: 1,
      price: 5,
      img: "/images/cappuccino.jpg",
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
          response = await fetch(`/api/orders/${order.id}/prepare`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order),
          });
          break;
        case "ready":
          response = await fetch(`/api/orders/${order.id}/ready`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order),
          });
          break;
        case "completed":
          response = await fetch(`/api/orders/${order.id}/complete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order),
          });
          break;
        case "cancelled":
          response = await fetch(`/api/orders/${order.id}/cancel`, {
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
    } catch (error) {
      console.error("Error handling order action:", error);
    }
  };

  const handleConfirm = (): void => {
    // Handle order completion logic here
    if (selectedOrder) {
      console.log(`Order ${selectedOrder.id} confirmed as completed`);
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
              key={order.id}
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
