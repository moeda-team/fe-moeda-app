import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import clsx from "clsx"; // Optional: for cleaner class logic

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
  const { query, pathname } = router;

  const isActive = pathname === "/" ? true : query.category === category;

  return (
    <div className="text-center flex items-center flex-col">
      <motion.div
        onClick={() => {
          const base =
            router.pathname === "/cashier-menu" ? "/cashier-menu" : "/menu";
          router.push(`${base}?category=${category}`);
        }}
        className={clsx(
          "w-16 h-16 rounded-full flex items-center justify-center shadow-md cursor-pointer",
          isActive ? "bg-primary-500" : "bg-neutral-300"
        )}
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
          className={clsx(
            "object-contain",
            !isActive && "grayscale opacity-60"
          )}
        />
      </motion.div>
      <span className={clsx("font-semibold", !isActive && "text-neutral-200")}>
        {title}
      </span>
    </div>
  );
}
