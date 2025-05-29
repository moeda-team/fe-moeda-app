// components/category/index.tsx
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

interface CategoryProps {
  icon: string; // image path
  alt?: string;
  title: string;
  category: string;
}

export default function Category({
  icon,
  alt = "Category Icon",
  title,
  category,
}: CategoryProps) {
  const router = useRouter();

  return (
    <div className="text-center flex items-center flex-col">
      <motion.div
        onClick={() => {
          if (router.pathname === "/cashier-menu") {
            router.push("/cashier-menu?category=" + category);
            return;
          }
          router.push("/menu?category=" + category);
        }}
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
      <span className="font-semibold">{title}</span>
    </div>
  );
}
