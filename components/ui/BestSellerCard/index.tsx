import React from "react";

interface BestSellerCardProps {
  onOpenPopupOrder: () => void;
  onSetProductDetail: () => void;
  title: string;
  image: string;
}

const BestSellerCard = ({
  title,
  image,
  onOpenPopupOrder,
  onSetProductDetail,
}: BestSellerCardProps) => {
  return (
    <div
      className="h-[160px] w-[140px] bg-black rounded-t-[100px_12px] rounded-b-[100px_12px] bg-cover bg-center bg-no-repeat flex items-end justify-center"
      style={{ backgroundImage: `url(${image})`, objectFit: "fill" }}
      onClick={() => {
        onOpenPopupOrder();
        onSetProductDetail();
      }}
    >
      <span className="text-sm text-center font-semibold text-white py-2">
        {title}
      </span>
    </div>
  );
};

export default BestSellerCard;
