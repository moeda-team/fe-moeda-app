import { Category } from "@/components/ui";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

const categories = [
  {
    icon: "/images/product.png",
    alt: "Product Category",
    title: "Makanan",
    category: "food",
  },
  {
    icon: "/images/product.png",
    alt: "Product Category",
    title: "Minuman",
    category: "drink",
  },
  {
    icon: "/images/product.png",
    alt: "Product Category",
    title: "Kue",
    category: "dessert",
  },
  {
    icon: "/images/product.png",
    alt: "Product Category",
    title: "Lainnya",
    category: "other",
  },
  {
    icon: "/images/product.png",
    alt: "Product Category",
    title: "Kopi",
    category: "coffee",
  },
  {
    icon: "/images/product.png",
    alt: "Product Category",
    title: "Teh",
    category: "tea",
  },
  {
    icon: "/images/product.png",
    alt: "Product Category",
    title: "Juice",
    category: "juice",
  },
  {
    icon: "/images/product.png",
    alt: "Product Category",
    title: "Camilan",
    category: "snack",
  },
  {
    icon: "/images/product.png",
    alt: "Product Category",
    title: "Mie",
    category: "noodle",
  },
  {
    icon: "/images/product.png",
    alt: "Product Category",
    title: "Roti",
    category: "bread",
  },
  {
    icon: "/images/product.png",
    alt: "Product Category",
    title: "Susu",
    category: "milk",
  },
  {
    icon: "/images/product.png",
    alt: "Product Category",
    title: "Soda",
    category: "soda",
  },
  {
    icon: "/images/product.png",
    alt: "Product Category",
    title: "Beku",
    category: "frozen",
  },
  {
    icon: "/images/product.png",
    alt: "Product Category",
    title: "Vegetarian",
    category: "vegetarian",
  },
];

export default function CategoryList() {
  const router = useRouter();
  const { category: activeCategory } = router.query;
  const activeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        inline: "center",
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeCategory]);

  return (
    <div className="relative w-full overflow-x-auto no-scrollbar">
      <div className="flex gap-4 py-4 px-4 items-center w-fit">
        {categories.map((cat, idx) => {
          const isActive = activeCategory === cat.category;
          return (
            <div key={idx} ref={isActive ? activeRef : null}>
              <Category
                icon={cat.icon}
                alt={`${cat.alt} ${idx + 1}`}
                title={cat.title}
                category={cat.category}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
