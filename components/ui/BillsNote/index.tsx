import React, { useEffect, useRef } from "react";
import QRCodeGenerator from "../QRCodeGenerator";
import moment from "moment";
import { formatToIDR } from "@/utils/formatCurrency";
import html2canvas from "html2canvas";
import { useRouter } from "next/router";

interface OrderDetail {
  id: string;
  customerName: string;
  tableNumber: string;
  createdAt: string;
  details: Array<{
    quantity: number;
    menuName: string;
    price: number;
  }>;
  tax: number;
  serviceCharge: number;
  subTotal: number;
  total: number;
}

interface BillsNoteProps {
  orderDetail: OrderDetail | null;
}

const BillsNote: React.FC<BillsNoteProps> = ({ orderDetail }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Auto-download function
  const downloadReceipt = async () => {
    console.log("Download function called", {
      orderDetail: orderDetail?.id,
      ref: receiptRef.current,
    });

    if (!receiptRef.current || !orderDetail?.id) {
      console.log("Early return - missing ref or orderDetail");
      return;
    }

    try {
      console.log("Starting canvas conversion...");

      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true, // Enable logging for debugging
        height: receiptRef.current.scrollHeight,
        width: receiptRef.current.scrollWidth,
      });

      console.log("Canvas created successfully");

      // Convert canvas to blob
      canvas.toBlob(
        (blob: Blob | null) => {
          if (!blob) {
            console.error("Failed to create blob");
            return;
          }

          console.log("Blob created, starting download...");
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `receipt-${orderDetail.id}.png`;
          link.style.display = "none"; // Hide the link
          document.body.appendChild(link);
          link.click();

          // Clean up
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            console.log("Download completed and cleaned up");
          }, 100);
        },
        "image/png",
        0.95
      );
    } catch (error) {
      console.error("Error downloading receipt:", error);

      // Fallback: Print dialog
      try {
        const printWindow = window.open("", "_blank");
        if (printWindow && receiptRef.current) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Receipt - ${orderDetail.id}</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 20px; }
                  .receipt { max-width: 480px; margin: 0 auto; }
                  .space-y-4 > * + * { margin-top: 1rem; }
                  .space-y-2 > * + * { margin-top: 0.5rem; }
                  .mb-6 { margin-bottom: 1.5rem; }
                  .mb-4 { margin-bottom: 1rem; }
                  .pt-4 { padding-top: 1rem; }
                  .pt-2 { padding-top: 0.5rem; }
                  .pt-3 { padding-top: 0.75rem; }
                  .border-t { border-top: 1px solid #e5e7eb; }
                  .border-t-2 { border-top: 2px solid #d1d5db; }
                  .flex { display: flex; }
                  .justify-between { justify-content: space-between; }
                  .text-center { text-align: center; }
                  .font-bold { font-weight: bold; }
                  .text-gray-600 { color: #6b7280; }
                  .text-gray-700 { color: #374151; }
                  .text-gray-800 { color: #1f2937; }
                  .text-gray-500 { color: #9ca3af; }
                  .text-2xl { font-size: 1.5rem; }
                  .text-lg { font-size: 1.125rem; }
                </style>
              </head>
              <body>
                <div class="receipt">
                  ${receiptRef.current.innerHTML}
                </div>
                <script>
                  window.onload = function() {
                    window.print();
                    window.close();
                  }
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();
        } else {
          console.error("Failed to open print window");
        }
      } catch (printError) {
        console.error("Print fallback also failed:", printError);
      }
    }
  };

  // Auto-download when orderID appears
  useEffect(() => {
    if (orderDetail?.id) {
      console.log("Order ID found, setting timer for download");
      // Small delay to ensure component is fully rendered
      const timer = setTimeout(() => {
        console.log("Timer expired, calling download");
        downloadReceipt();
      }, 2000); // Increased delay to 2 seconds
      router.push("/feedback");
      return () => {
        console.log("Cleaning up timer");
        clearTimeout(timer);
      };
    }
  }, [orderDetail?.id]); // Make sure this dependency is correct

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div ref={receiptRef} className="space-y-4 bg-white p-4 w-[480px]">
        {orderDetail && (
          <>
            {/* Header */}
            <div className="flex flex-col items-center justify-center mb-6">
              <h1 className="text-2xl font-bold mb-2 text-gray-800">
                Thank You For Order
              </h1>
              <p className="text-gray-600 mb-4">
                {orderDetail?.createdAt
                  ? moment(orderDetail?.createdAt).format("DD MMMM YYYY")
                  : ""}
              </p>
              <QRCodeGenerator link={`/order?orderId=${orderDetail?.id}`} />
              <p className="text-center text-gray-500 mb-6">
                Scan here to view your orders
              </p>
            </div>

            {/* Order Details */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID</span>
                <span className="text-gray-800 font-medium">
                  {orderDetail?.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer Name</span>
                <span className="text-gray-800 font-medium">
                  {orderDetail?.customerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Table</span>
                <span className="text-gray-800 font-medium">
                  {orderDetail?.tableNumber}
                </span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Payment Details
              </h2>

              {/* Order Items */}
              <div className="space-y-2 mb-4">
                {Array.isArray(orderDetail?.details) &&
                  orderDetail?.details?.map((detail: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-700">
                        {detail?.quantity}x {detail?.menuName}
                      </span>
                      <span className="text-gray-700">
                        {formatToIDR(detail?.price)}
                      </span>
                    </div>
                  ))}
              </div>

              {/* Subtotal */}
              <div className="border-t border-gray-200 pt-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-700">
                    Subtotal{" "}
                    <span className="text-gray-500">
                      ({orderDetail?.details?.length || 0} menu)
                    </span>
                  </span>
                  <span className="text-gray-700">
                    {formatToIDR(orderDetail?.subTotal)}
                  </span>
                </div>
              </div>

              {/* Fees and charges */}
              <div className="space-y-2 border-t border-gray-200 pt-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-700">Tax</span>
                  <span className="text-gray-700">
                    {formatToIDR(orderDetail?.tax)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Service Charge</span>
                  <span className="text-gray-700">
                    {formatToIDR(orderDetail?.serviceCharge)}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t-2 border-gray-300 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-lg font-bold text-gray-800">
                    {formatToIDR(orderDetail?.total)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BillsNote;
