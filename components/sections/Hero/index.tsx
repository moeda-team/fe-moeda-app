// components/hero/index.tsx
import Image from "next/image";
import { CategoryList } from "@/components/sections";
export default function Hero() {
  return (
    <div className="relative h-[200px]">
      <div className="absolute w-[700px] h-[620px] bg-primary-500 rounded-full -translate-y-1/2 -translate-x-1/2 left-1/2 -top-28"></div>
      <div className="text-center relative py-8">
        <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto">
          <Image
            src="/logo.png"
            alt="Moeda Coffee Logo"
            width={64}
            height={64}
            className="object-contain"
            fetchPriority="low"
          />
        </div>
        <p className="text-white font-semibold mt-2 text-2xl">MOEDA COFFE</p>
      </div>
      <CategoryList />
    </div>
  );
}
