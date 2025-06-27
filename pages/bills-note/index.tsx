import QRCodeGenerator from "@/components/ui/QRCodeGenerator";
import { getDetailOrder } from "@/swr/get/getOrder";
import { formatToIDR } from "@/utils/formatCurrency";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FiDownload } from "react-icons/fi";
import nookies from "nookies";

const ReceiptPage = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const [idOrder, setIdOrder] = useState<string | undefined>(
    orderId?.toString()
  );
  const { orderDetail } = getDetailOrder(idOrder);
  const receiptRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const orderId = nookies.get().orderId;
    if (orderId) {
      setIdOrder(orderId);
    }
  }, []);
  // Manual download function
  const downloadReceipt = async () => {
    if (!receiptRef.current || !orderDetail?.id) {
      return;
    }

    setIsDownloading(true);

    try {
      // Since html2canvas isn't available, we'll use a fallback approach
      // Create a print-friendly version
      const printWindow = window.open("", "_blank");
      if (printWindow && receiptRef.current) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt - ${orderDetail.id}</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  margin: 20px; 
                  background: white;
                }
                .receipt { 
                  max-width: 480px; 
                  margin: 0 auto; 
                  padding: 20px;
                  border: 1px solid #ccc;
                }
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
                .items-center { align-items: center; }
                .flex-col { flex-direction: column; }
                .justify-center { justify-content: center; }
                @media print {
                  body { margin: 0; }
                  .receipt { border: none; }
                }
              </style>
            </head>
            <body>
              <div class="receipt">
                ${(receiptRef.current as HTMLElement).innerHTML}
              </div>
              <script>
                window.onload = function() {
                  setTimeout(() => {
                    window.print();
                  }, 500);
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
        router.push("/feedback");
      }
    } catch (error) {
      console.error("Error downloading receipt:", error);
      alert("Failed to download receipt. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto">
        {/* Download Button */}
        <div className="mb-6 text-center">
          <button
            onClick={downloadReceipt}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            <FiDownload className="w-5 h-5" />
            {isDownloading ? "Downloading..." : "Download Receipt"}
          </button>
        </div>

        {/* Receipt */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div ref={receiptRef} className="space-y-4 bg-white p-6 w-full">
            {/* Header */}
            <div className="flex flex-col items-center justify-center mb-6">
              <h1 className="text-2xl font-bold mb-2 text-gray-800">
                Thank You For Order
              </h1>
              <p className="text-gray-600 mb-4">
                {orderDetail.createdAt
                  ? moment(orderDetail.createdAt).format("DD/MM/YYYY")
                  : ""}
              </p>
              <QRCodeGenerator
                link={`${process.env.NEXT_PUBLIC_BASE_PATH}/order?orderId=${orderDetail.id}`}
              />
              <p className="text-center text-gray-500">
                Scan here to view your orders
              </p>
              <p>
                or{" "}
                <Link
                  className="text-blue-500 font-bold"
                  href={`/order?orderId=${orderDetail.id}`}
                  target="_blank"
                >
                  Click Here
                </Link>
              </p>
            </div>

            {/* Order Details */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID</span>
                <span className="text-gray-800 font-medium">
                  {orderDetail.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer Name</span>
                <span className="text-gray-800 font-medium">
                  {orderDetail.customerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Table</span>
                <span className="text-gray-800 font-medium">
                  {orderDetail.tableNumber}
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
                {Array.isArray(orderDetail.subTransactions) &&
                  orderDetail.subTransactions.map(
                    (detail: any, index: number) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-700">
                          {detail.quantity}x {detail.menuName}
                        </span>
                        <span className="text-gray-700">
                          {formatToIDR(detail.price)}
                        </span>
                      </div>
                    )
                  )}
              </div>

              {/* Subtotal */}
              <div className="border-t border-gray-200 pt-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-700">
                    Subtotal{" "}
                    <span className="text-gray-500">
                      (
                      {Array.isArray(orderDetail.subTransactions) &&
                        orderDetail.subTransactions.length}{" "}
                      menu)
                    </span>
                  </span>
                  <span className="text-gray-700">
                    {formatToIDR(orderDetail.subTotal)}
                  </span>
                </div>
              </div>

              {/* Fees and charges */}
              <div className="space-y-2 border-t border-gray-200 pt-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-700">Tax</span>
                  <span className="text-gray-700">
                    {formatToIDR(orderDetail.tax)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Service Charge</span>
                  <span className="text-gray-700">
                    {formatToIDR(orderDetail.serviceCharge)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Rounding</span>
                  <span className="text-gray-700">
                    {formatToIDR(orderDetail.rounding)}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t-2 border-gray-300 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-lg font-bold text-gray-800">
                    {formatToIDR(orderDetail.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;
