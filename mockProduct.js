export const mockProducts = [
  {
    productId: "matcha-latte-001",
    productName: "Matcha Latte",
    description: "A creamy blend of premium matcha and milk.",
    basePrice: 20000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["hot", "ice"],
    availableSizes: ["regular", "large"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: true
    }
  },
  {
    productId: "matcha-espresso-002",
    productName: "Matcha Espresso Fusion",
    description: "Layered matcha with a shot of bold espresso.",
    basePrice: 25000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["ice"],
    availableSizes: ["regular", "large"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: true
    }
  },
  {
    productId: "matcha-float-003",
    productName: "Matcha Float",
    description: "Iced matcha latte topped with a scoop of vanilla ice cream.",
    basePrice: 28000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["ice"],
    availableSizes: ["large"],
    customizable: {
      iceCube: false,
      sweet: true,
      note: true
    }
  },
  {
    productId: "matcha-vanilla-004",
    productName: "Vanilla Matcha",
    description: "Sweet vanilla twist blended with matcha.",
    basePrice: 22000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["hot", "ice"],
    availableSizes: ["regular", "large"],
    customizable: {
      iceCube: true,
      sweet: false,
      note: true
    }
  }
];
