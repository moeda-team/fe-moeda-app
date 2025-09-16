import React from "react";

interface SubTransaction {
  id: string;
  menuName: string;
  status: "preparation" | "completed";
}

interface ProgressProps {
  subTransactions: SubTransaction[];
}

const OrderProgress: React.FC<ProgressProps> = ({ subTransactions }) => {
  const total = subTransactions.length;
  const completedCount = subTransactions.filter(
    (s) => s.status === "completed"
  ).length;

  const progress = total > 0 ? (completedCount / total) * 100 : 0;

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative w-full h-2 bg-gray-200 rounded">
        <div
          className={`absolute h-2 rounded transition-all duration-500 ${
            completedCount === total ? "bg-green-500" : "bg-[#3264DA]"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Label progress pesanan */}
      <p className="text-xs my-1 text-gray-600">
        {completedCount}/{total} pesanan selesai
      </p>
    </div>
  );
};

export default OrderProgress;
