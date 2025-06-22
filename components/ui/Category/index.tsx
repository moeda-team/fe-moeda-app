import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import clsx from "clsx"; // Optional: for cleaner class logic

interface CategoryProps {
  image: string; // image path
  alt?: string;
  title: string;
  category: string;
}

export default function Category({ image, title, category }: CategoryProps) {
  const router = useRouter();
  const { query, pathname } = router;

  const isActive = pathname === "/" ? true : query.category === category;

  return (
    <div className="text-center flex items-center flex-col w-16 sm:w-20 md:w-24 relative h-[110px]">
      <motion.div
        onClick={() => {
          let basePath = "";
          if (pathname === "/") {
            basePath = "/menu";
          } else if (pathname === "/cashier-menu") {
            basePath = "/cashier-menu";
          } else if (pathname === "/menu") {
            basePath = "/menu";
          } else if (pathname === "admin-cashier-menu") {
            basePath = "/admin-cashier-menu";
          }
          router.push(`${basePath}?category=${category}`);
        }}
        className={clsx(
          "w-16 h-16 rounded-full flex items-center justify-center shadow-md cursor-pointer flex-shrink-0",
          isActive ? "bg-primary-500" : "bg-neutral-300"
        )}
        whileHover={{
          scale: 1.1,
          transition: { duration: 0.2 },
        }}
        whileTap={{ scale: 0.95 }}
      >
        <Image
          priority
          src={image}
          alt={title}
          width={44}
          height={44}
          className={clsx(
            "object-contain",
            !isActive && "grayscale opacity-60"
          )}
        />
      </motion.div>
      <span
        className={clsx(
          "font-semibold text-xs sm:text-sm mt-2 leading-tight break-words hyphens-auto w-full absolute translate-y-14",
          !isActive && "text-neutral-200"
        )}
        style={{ wordWrap: "break-word" }}
      >
        {title}
      </span>
    </div>
  );
}
