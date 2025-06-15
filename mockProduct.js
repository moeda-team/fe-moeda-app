export const mockProducts = [
  // MATCHA CLASSICS (1-10)
  {
    id: "matcha-latte-001",
    name: "Matcha Latte",
    description: "A creamy blend of premium matcha and milk.",
    price: 20000,
    img: "/images/product-image.webp",
    availableTypes: ["hot", "ice"],
    availableSizes: ["regular", "large"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: true
    }
  },
  {
    id: "matcha-espresso-002",
    name: "Matcha Espresso Fusion",
    description: "Layered matcha with a shot of bold espresso.",
    price: 25000,
    img: "/images/product-image.webp",
    availableTypes: ["ice"],
    availableSizes: ["regular", "large"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: true
    }
  },
  {
    id: "matcha-float-003",
    name: "Matcha Float",
    description: "Iced matcha latte topped with a scoop of vanilla ice cream.",
    price: 28000,
    img: "/images/product-image.webp",
    availableTypes: ["ice"],
    availableSizes: ["large"],
    customizable: {
      iceCube: false,
      sweet: true,
      note: true
    }
  },
  {
    id: "vanilla-matcha-004",
    name: "Vanilla Matcha",
    description: "Sweet vanilla twist blended with matcha.",
    price: 22000,
    img: "/images/product-image.webp",
    availableTypes: ["hot", "ice"],
    availableSizes: ["regular", "large"],
    customizable: {
      iceCube: true,
      sweet: false,
      note: true
    }
  },
  {
    id: "strawberry-matcha-005",
    name: "Strawberry Matcha",
    description: "Fruity strawberry syrup mixed with smooth matcha.",
    price: 24000,
    img: "/images/product-image.webp",
    availableTypes: ["ice"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: false
    }
  },
  {
    id: "honey-matcha-006",
    name: "Honey Matcha",
    description: "A soothing blend of matcha and natural honey.",
    price: 23000,
    img: "/images/product-image.webp",
    availableTypes: ["hot"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: false,
      sweet: false,
      note: true
    }
  },
  {
    id: "coconut-matcha-007",
    name: "Coconut Matcha",
    description: "Refreshing matcha with creamy coconut milk.",
    price: 26000,
    img: "/images/product-image.webp",
    availableTypes: ["ice"],
    availableSizes: ["large"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: true
    }
  },
  {
    id: "almond-matcha-008",
    name: "Almond Matcha",
    description: "Nutty almond flavor blended into a creamy matcha.",
    price: 25000,
    img: "/images/product-image.webp",
    availableTypes: ["hot", "ice"],
    availableSizes: ["regular", "large"],
    customizable: {
      iceCube: true,
      sweet: false,
      note: true
    }
  },
  {
    id: "brown-sugar-matcha-009",
    name: "Brown Sugar Matcha",
    description: "Rich brown sugar flavor infused with matcha.",
    price: 27000,
    img: "/images/product-image.webp",
    availableTypes: ["ice"],
    availableSizes: ["large"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: false
    }
  },
  {
    id: "mocha-matcha-010",
    name: "Mocha Matcha",
    description: "A fusion of chocolate mocha and vibrant matcha.",
    price: 28000,
    img: "/images/product-image.webp",
    availableTypes: ["hot"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: false,
      sweet: true,
      note: true
    }
  },

  // SPECIALTY MATCHA (11-20)
  {
    id: "taro-matcha-011",
    name: "Taro Matcha Fusion",
    description: "Purple taro root perfectly paired with earthy matcha.",
    price: 29000,
    img: "/images/product-image.webp",
    availableTypes: ["ice"],
    availableSizes: ["regular", "large"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: true
    }
  },
  {
    id: "ube-matcha-012",
    name: "Ube Matcha Dream",
    description: "Filipino purple yam meets Japanese matcha tradition.",
    price: 30000,
    img: "/images/product-image.webp",
    availableTypes: ["ice"],
    availableSizes: ["large"],
    customizable: {
      iceCube: true,
      sweet: false,
      note: true
    }
  },
  {
    id: "black-sesame-matcha-013",
    name: "Black Sesame Matcha",
    description: "Toasted black sesame with premium matcha powder.",
    price: 31000,
    img: "/images/product-image.webp",
    availableTypes: ["hot", "ice"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: false
    }
  },
  {
    id: "rose-matcha-014",
    name: "Rose Garden Matcha",
    description: "Delicate rose petals infused with ceremonial matcha.",
    price: 32000,
    img: "/images/product-image.webp",
    availableTypes: ["hot"],
    availableSizes: ["regular", "large"],
    customizable: {
      iceCube: false,
      sweet: true,
      note: true
    }
  },
  {
    id: "lavender-matcha-015",
    name: "Lavender Matcha Bliss",
    description: "Calming lavender essence with smooth matcha base.",
    price: 30000,
    img: "/images/product-image.webp",
    availableTypes: ["hot", "ice"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: true,
      sweet: false,
      note: true
    }
  },
  {
    id: "pandan-matcha-016",
    name: "Pandan Matcha Twist",
    description: "Southeast Asian pandan leaf with traditional matcha.",
    price: 28000,
    img: "/images/product-image.webp",
    availableTypes: ["ice"],
    availableSizes: ["regular", "large"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: true
    }
  },
  {
    id: "yuzu-matcha-017",
    name: "Yuzu Matcha Citrus",
    description: "Bright yuzu citrus balanced with earthy matcha.",
    price: 33000,
    img: "/images/product-image.webp",
    availableTypes: ["ice"],
    availableSizes: ["large"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: false
    }
  },
  {
    id: "sakura-matcha-018",
    name: "Sakura Matcha Blossom",
    description: "Cherry blossom petals meet spring matcha harmony.",
    price: 35000,
    img: "/images/product-image.webp",
    availableTypes: ["hot"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: false,
      sweet: false,
      note: true
    }
  },
  {
    id: "mango-matcha-019",
    name: "Tropical Mango Matcha",
    description: "Fresh mango puree swirled with cooling matcha.",
    price: 27000,
    img: "/images/product-image.webp",
    availableTypes: ["ice"],
    availableSizes: ["regular", "large"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: true
    }
  },
  {
    id: "lychee-matcha-020",
    name: "Lychee Matcha Refresher",
    description: "Exotic lychee fruit complementing smooth matcha.",
    price: 29000,
    img: "/images/product-image.webp",
    availableTypes: ["ice"],
    availableSizes: ["large"],
    customizable: {
      iceCube: true,
      sweet: false,
      note: true
    }
  },

  // PREMIUM COLLECTION (21-30)
  {
    id: "ceremonial-matcha-021",
    name: "Ceremonial Grade Matcha",
    description: "Pure ceremonial matcha whisked to perfection.",
    price: 45000,
    img: "/images/product-image.webp",
    availableTypes: ["hot"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: false,
      sweet: false,
      note: true
    }
  },
  {
    id: "gold-leaf-matcha-022",
    name: "Gold Leaf Matcha Royale",
    description: "Premium matcha adorned with edible gold leaf.",
    price: 55000,
    img: "/images/product-image.webp",
    availableTypes: ["hot", "ice"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: true
    }
  },
  {
    id: "truffle-matcha-023",
    name: "White Truffle Matcha",
    description: "Luxurious white chocolate truffle with matcha.",
    price: 48000,
    img: "/images/product-image.webp",
    availableTypes: ["hot"],
    availableSizes: ["regular", "large"],
    customizable: {
      iceCube: false,
      sweet: true,
      note: false
    }
  },
  {
    id: "aged-matcha-024",
    name: "Aged Matcha Reserve",
    description: "Specially aged matcha with complex flavor notes.",
    price: 52000,
    img: "/images/product-image.webp",
    availableTypes: ["hot"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: false,
      sweet: false,
      note: true
    }
  },
  {
    id: "diamond-dust-matcha-025",
    name: "Diamond Dust Matcha",
    description: "Sparkling matcha with shimmering edible glitter.",
    price: 42000,
    img: "/images/product-image.webp",
    availableTypes: ["ice"],
    availableSizes: ["large"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: true
    }
  },
  {
    id: "caviar-pearls-matcha-026",
    name: "Matcha Caviar Pearls",
    description: "Matcha with bursting fruit caviar pearls.",
    price: 38000,
    img: "/images/product-image.webp",
    availableTypes: ["ice"],
    availableSizes: ["regular", "large"],
    customizable: {
      iceCube: true,
      sweet: false,
      note: true
    }
  },
  {
    id: "nitrogen-matcha-027",
    name: "Nitrogen Infused Matcha",
    description: "Creamy nitrogen-infused matcha with velvety texture.",
    price: 40000,
    img: "/images/product-image.webp",
    availableTypes: ["ice"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: false,
      sweet: true,
      note: false
    }
  },
  {
    id: "smoke-bubble-matcha-028",
    name: "Smoke Bubble Matcha",
    description: "Theatrical matcha served with aromatic smoke bubble.",
    price: 50000,
    img: "/images/product-image.webp",
    availableTypes: ["hot", "ice"],
    availableSizes: ["large"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: true
    }
  },
  {
    id: "crystal-matcha-029",
    name: "Crystal Clear Matcha",
    description: "Transparent matcha using molecular gastronomy.",
    price: 47000,
    img: "/images/product-image.webp",
    availableTypes: ["ice"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: true,
      sweet: false,
      note: true
    }
  },
  {
    id: "levitating-matcha-030",
    name: "Levitating Matcha Sphere",
    description: "Gravity-defying matcha presentation experience.",
    price: 60000,
    img: "/images/product-image.webp",
    availableTypes: ["hot"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: false,
      sweet: true,
      note: false
    }
  },

  // SEASONAL SPECIALS (31-40)
  {
    id: "winter-spice-matcha-031",
    name: "Winter Spice Matcha",
    description: "Warming spices of cinnamon and cardamom with matcha.",
    price: 26000,
    img: "/images/product-image.webp",
    availableTypes: ["hot"],
    availableSizes: ["regular", "large"],
    customizable: {
      iceCube: false,
      sweet: true,
      note: true
    }
  },
  {
    id: "pumpkin-matcha-032",
    name: "Pumpkin Spice Matcha",
    description: "Autumn pumpkin puree blended with earthy matcha.",
    price: 28000,
    img: "/images/product-image.webp",
    availableTypes: ["hot", "ice"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: false
    }
  },
  {
    id: "cranberry-matcha-033",
    name: "Cranberry Matcha Tart",
    description: "Tart cranberry balanced with smooth matcha sweetness.",
    price: 25000,
    img: "/images/product-image.webp",
    availableTypes: ["ice"],
    availableSizes: ["regular", "large"],
    customizable: {
      iceCube: true,
      sweet: false,
      note: true
    }
  },
  {
    id: "gingerbread-matcha-034",
    name: "Gingerbread Matcha Cookie",
    description: "Holiday gingerbread flavors meet traditional matcha.",
    price: 30000,
    img: "/images/product-image.webp",
    availableTypes: ["hot"],
    availableSizes: ["large"],
    customizable: {
      iceCube: false,
      sweet: true,
      note: true
    }
  },
  {
    id: "mint-chocolate-matcha-035",
    name: "Mint Chocolate Matcha",
    description: "Cool mint and rich chocolate layered with matcha.",
    price: 29000,
    img: "/images/product-image.webp",
    availableTypes: ["ice"],
    availableSizes: ["regular", "large"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: false
    }
  },
  {
    id: "elderflower-matcha-036",
    name: "Elderflower Matcha Spring",
    description: "Delicate elderflower essence with fresh matcha notes.",
    price: 31000,
    img: "/images/product-image.webp",
    availableTypes: ["ice"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: true,
      sweet: false,
      note: true
    }
  },
  {
    id: "watermelon-matcha-037",
    name: "Watermelon Matcha Cooler",
    description: "Refreshing summer watermelon with cooling matcha.",
    price: 24000,
    img: "/images/product-image.webp",
    availableTypes: ["ice"],
    availableSizes: ["large"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: true
    }
  },
  {
    id: "peach-matcha-038",
    name: "Peach Blossom Matcha",
    description: "Sweet summer peaches harmonized with matcha green.",
    price: 27000,
    img: "/images/product-image.webp",
    availableTypes: ["ice"],
    availableSizes: ["regular", "large"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: false
    }
  },
  {
    id: "fig-matcha-039",
    name: "Fresh Fig Matcha",
    description: "Mediterranean figs paired with Japanese matcha tradition.",
    price: 33000,
    img: "/images/product-image.webp",
    availableTypes: ["hot", "ice"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: true,
      sweet: false,
      note: true
    }
  },
  {
    id: "pomegranate-matcha-040",
    name: "Pomegranate Matcha Antioxidant",
    description: "Superfood pomegranate seeds with antioxidant-rich matcha.",
    price: 32000,
    img: "/images/product-image.webp",
    availableTypes: ["ice"],
    availableSizes: ["regular", "large"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: true
    }
  }
];