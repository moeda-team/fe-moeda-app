// components/category/index.tsx
import Image from "next/image";
import { motion } from "framer-motion";

interface CategoryProps {
  icon: string; // image path
  alt?: string;
}

export default function Category({
  icon,
  alt = "Category Icon",
}: CategoryProps) {
  return (
    <motion.div
      className="w-16 h-16 rounded-full bg-[#F4A940] flex items-center justify-center shadow-md cursor-pointer"
      whileHover={{
        scale: 1.1,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.95 }}
    >
      <Image
        fetchPriority="low"
        src={icon}
        alt={alt}
        width={44}
        height={44}
        className="object-contain"
      />
    </motion.div>
  );
}
