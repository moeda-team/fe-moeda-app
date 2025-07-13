import { Hero } from "@/components/sections";
import ConfirmationPopup from "@/components/ui/ConfirmOrderPopup";
import OrderCard from "@/components/ui/OrderListCard";
import { getAccessToken } from "@/helpers/getAccessToken";
import { getActiveOrder } from "@/swr/get/activeOrder";
import { getBaristaOrder } from "@/swr/get/getBaristaOrder";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface OrderProduct {
  id: string;
  menuName: string;
  type: "Hot" | "Ice";
  size: "Regular" | "Large";
  iceCube: "Less" | "Normal" | "More Ice" | "No Ice Cube";
  sweet: "Normal" | "Less Sugar";
  addOns: "Extra Cheese" | "Fried Egg" | "Crackers";
  spicyLevel: "Mild" | "Medium" | "Hot";
  note?: string;
  quantity: number;
  price?: number;
  menu: {
    img: string;
  };
  status: "preparation" | "ready" | "completed" | "failed";
  addOn: string[] | string;
}

export default function OrderTable() {
  const accessToken = getAccessToken();
  const { activeOrder, mutate } = getActiveOrder("", "", "", true);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const onActionOrder = async (order: OrderProduct): Promise<void> => {
    setSelectedOrder(order);
    setShowPopup(true);
  };

  const handleConfirm = async () => {
    const bearerAuth = `Bearer ${accessToken}`;
    try {
      let status = selectedOrder.status;

      if (status === "preparation") {
        status = "completed";
      } else {
        status = "preparation";
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/transactions/main/status/${selectedOrder.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: bearerAuth,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      if (data.status === "success") {
        toast.success("Pesanan Berhasil Dirubah");
        mutate();
      } else {
        toast.error("Gagal mengubah status pesanan");
      }
    } catch (error) {
      toast.error("Gagal mengubah status pesanan");
      console.error("Error handling order action:", error);
    }

    setShowPopup(false);
    setSelectedOrder(null);
  };

  const handleCancel = (): void => {
    setShowPopup(false);
    setSelectedOrder(null);
  };

  // Mutate every 10 second
  useEffect(() => {
    const interval = setInterval(() => {
      mutate();
    }, 10000);
    return () => clearInterval(interval);
  }, [mutate]);

  return (
    <div className="bg-neutral-50">
      <Hero isCustomer={false} />
      <div className="min-h-screen p-6 space-y-12">
        {Array.isArray(activeOrder?.transactions) &&
          activeOrder?.transactions.length > 0 &&
          activeOrder?.transactions.map((tx: any) => {
            return (
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
                  ORDER TABLE {tx.tableNumber}
                </h1>
                <div className="w-full h-0.5 bg-neutral-300 mt-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                  {tx.subTransactions.map(
                    (product: OrderProduct, index: number) => {
                      const addOn: string[] = Array.isArray(product.addOn)
                        ? product.addOn
                        : product.addOn?.split(",") || [];

                      return (
                        <OrderCard
                          index={index}
                          key={product.id}
                          order={{ ...product, addOn }}
                          onActionOrder={onActionOrder}
                        />
                      );
                    }
                  )}
                </div>
              </div>
            );
          })}

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
