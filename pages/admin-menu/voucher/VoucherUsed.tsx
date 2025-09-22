import React from "react";

interface ProgressProps {
  total:number
  used:number
}

const VoucherUsed: React.FC<ProgressProps> = ({ total, used }) => {

  const progress = total > 0 ? (used / total) * 100 : 0;

  return (
    <div className="w-full my-2">
      {/* Progress bar */}
      <div className="relative w-full h-4 bg-gray-200 rounded-full">
        <div
          className={`absolute h-4 rounded-full transition-all duration-500 ${
            used === total ? "bg-green-500" : "bg-[#3264DA]"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Label progress pesanan */}
      <p className="text-xs mt-2 text-gray-600">
        {/* {completedCount}/{total} pesanan */}
        {used} from {total} voucher used
      </p>
    </div>
  );
};

export default VoucherUsed;
