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
      className="h-[220px] w-[180px] bg-black rounded-t-[80px] rounded-b-[80px] bg-cover bg-center bg-no-repeat flex items-end justify-center"
      style={{ backgroundImage: `url(${image})` }}
      onClick={() => {
        onOpenPopupOrder();
        onSetProductDetail();
      }}
    >
      <span className="text-sm font-normal text-white py-4">{title}</span>
    </div>
  );
};

export default BestSellerCard;
