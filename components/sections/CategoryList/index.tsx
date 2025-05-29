import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Category } from "@/components/ui";

const categories = new Array(16).fill({
  icon: "/images/product.png",
  alt: "Product Category",
});

export default function CategoryList() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const itemsPerPage = 4;
  const totalSlides = Math.ceil(categories.length / itemsPerPage);

  // Auto-rotate slides every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection("right");
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 3000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const visibleCategories = categories.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  // Handle manual slide navigation
  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  const variants = {
    enter: (direction: string) => ({
      x: direction === "right" ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: string) => ({
      x: direction === "right" ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full mx-auto overflow-hidden h-fit">
      <div className="relative h-14">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute top-0 left-0 right-0 flex justify-center gap-10"
          >
            {visibleCategories.map((cat, idx) => (
              <div key={`${currentIndex}-${idx}`} className="flex-shrink-0">
                <Category icon={cat.icon} alt={`${cat.alt} ${idx + 1}`} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center mt-6 gap-1">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1 rounded-full transition-colors ${
              index === currentIndex ? "bg-primary-500 w-5" : "bg-gray-300 w-2"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
