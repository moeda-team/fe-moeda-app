import { Category } from "@/components/ui";

const categories = new Array(4).fill({
  icon: "/images/product.png",
  alt: "Product Category",
  title: "Makanan",
  category: "food",
});

export default function CategoryList() {
  return (
    <div className="flex gap-4 py-4 items-center justify-center">
      {categories.map((cat, idx) => (
        <div key={`${idx}`}>
          <Category
            icon={cat.icon}
            alt={`${cat.alt} ${idx + 1}`}
            title={cat.title}
            category={cat.category}
          />
        </div>
      ))}
    </div>
  );
}
