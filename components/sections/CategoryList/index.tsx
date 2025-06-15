import { Category } from "@/components/ui";
import { getCategories } from "@/swr/get/categories";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

export default function CategoryList() {
  const { categories } = getCategories();
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
        {Array.isArray(categories) &&
          categories.map((cat, idx) => {
            const isActive = activeCategory === cat.category;
            return (
              <div key={idx} ref={isActive ? activeRef : null}>
                <Category
                  icon={"/images/product.png"}
                  alt={`${cat.name}`}
                  title={cat.name}
                  category={cat.id}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
