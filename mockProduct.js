export const mockProducts = [
  // MATCHA CLASSICS (1-10)
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
    productId: "vanilla-matcha-004",
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
  },
  {
    productId: "strawberry-matcha-005",
    productName: "Strawberry Matcha",
    description: "Fruity strawberry syrup mixed with smooth matcha.",
    basePrice: 24000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["ice"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: false
    }
  },
  {
    productId: "honey-matcha-006",
    productName: "Honey Matcha",
    description: "A soothing blend of matcha and natural honey.",
    basePrice: 23000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["hot"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: false,
      sweet: false,
      note: true
    }
  },
  {
    productId: "coconut-matcha-007",
    productName: "Coconut Matcha",
    description: "Refreshing matcha with creamy coconut milk.",
    basePrice: 26000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["ice"],
    availableSizes: ["large"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: true
    }
  },
  {
    productId: "almond-matcha-008",
    productName: "Almond Matcha",
    description: "Nutty almond flavor blended into a creamy matcha.",
    basePrice: 25000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["hot", "ice"],
    availableSizes: ["regular", "large"],
    customizable: {
      iceCube: true,
      sweet: false,
      note: true
    }
  },
  {
    productId: "brown-sugar-matcha-009",
    productName: "Brown Sugar Matcha",
    description: "Rich brown sugar flavor infused with matcha.",
    basePrice: 27000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["ice"],
    availableSizes: ["large"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: false
    }
  },
  {
    productId: "mocha-matcha-010",
    productName: "Mocha Matcha",
    description: "A fusion of chocolate mocha and vibrant matcha.",
    basePrice: 28000,
    imageUrl: "/images/card-menu.png",
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
    productId: "taro-matcha-011",
    productName: "Taro Matcha Fusion",
    description: "Purple taro root perfectly paired with earthy matcha.",
    basePrice: 29000,
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
    productId: "ube-matcha-012",
    productName: "Ube Matcha Dream",
    description: "Filipino purple yam meets Japanese matcha tradition.",
    basePrice: 30000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["ice"],
    availableSizes: ["large"],
    customizable: {
      iceCube: true,
      sweet: false,
      note: true
    }
  },
  {
    productId: "black-sesame-matcha-013",
    productName: "Black Sesame Matcha",
    description: "Toasted black sesame with premium matcha powder.",
    basePrice: 31000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["hot", "ice"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: false
    }
  },
  {
    productId: "rose-matcha-014",
    productName: "Rose Garden Matcha",
    description: "Delicate rose petals infused with ceremonial matcha.",
    basePrice: 32000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["hot"],
    availableSizes: ["regular", "large"],
    customizable: {
      iceCube: false,
      sweet: true,
      note: true
    }
  },
  {
    productId: "lavender-matcha-015",
    productName: "Lavender Matcha Bliss",
    description: "Calming lavender essence with smooth matcha base.",
    basePrice: 30000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["hot", "ice"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: true,
      sweet: false,
      note: true
    }
  },
  {
    productId: "pandan-matcha-016",
    productName: "Pandan Matcha Twist",
    description: "Southeast Asian pandan leaf with traditional matcha.",
    basePrice: 28000,
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
    productId: "yuzu-matcha-017",
    productName: "Yuzu Matcha Citrus",
    description: "Bright yuzu citrus balanced with earthy matcha.",
    basePrice: 33000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["ice"],
    availableSizes: ["large"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: false
    }
  },
  {
    productId: "sakura-matcha-018",
    productName: "Sakura Matcha Blossom",
    description: "Cherry blossom petals meet spring matcha harmony.",
    basePrice: 35000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["hot"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: false,
      sweet: false,
      note: true
    }
  },
  {
    productId: "mango-matcha-019",
    productName: "Tropical Mango Matcha",
    description: "Fresh mango puree swirled with cooling matcha.",
    basePrice: 27000,
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
    productId: "lychee-matcha-020",
    productName: "Lychee Matcha Refresher",
    description: "Exotic lychee fruit complementing smooth matcha.",
    basePrice: 29000,
    imageUrl: "/images/card-menu.png",
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
    productId: "ceremonial-matcha-021",
    productName: "Ceremonial Grade Matcha",
    description: "Pure ceremonial matcha whisked to perfection.",
    basePrice: 45000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["hot"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: false,
      sweet: false,
      note: true
    }
  },
  {
    productId: "gold-leaf-matcha-022",
    productName: "Gold Leaf Matcha Royale",
    description: "Premium matcha adorned with edible gold leaf.",
    basePrice: 55000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["hot", "ice"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: true
    }
  },
  {
    productId: "truffle-matcha-023",
    productName: "White Truffle Matcha",
    description: "Luxurious white chocolate truffle with matcha.",
    basePrice: 48000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["hot"],
    availableSizes: ["regular", "large"],
    customizable: {
      iceCube: false,
      sweet: true,
      note: false
    }
  },
  {
    productId: "aged-matcha-024",
    productName: "Aged Matcha Reserve",
    description: "Specially aged matcha with complex flavor notes.",
    basePrice: 52000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["hot"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: false,
      sweet: false,
      note: true
    }
  },
  {
    productId: "diamond-dust-matcha-025",
    productName: "Diamond Dust Matcha",
    description: "Sparkling matcha with shimmering edible glitter.",
    basePrice: 42000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["ice"],
    availableSizes: ["large"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: true
    }
  },
  {
    productId: "caviar-pearls-matcha-026",
    productName: "Matcha Caviar Pearls",
    description: "Matcha with bursting fruit caviar pearls.",
    basePrice: 38000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["ice"],
    availableSizes: ["regular", "large"],
    customizable: {
      iceCube: true,
      sweet: false,
      note: true
    }
  },
  {
    productId: "nitrogen-matcha-027",
    productName: "Nitrogen Infused Matcha",
    description: "Creamy nitrogen-infused matcha with velvety texture.",
    basePrice: 40000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["ice"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: false,
      sweet: true,
      note: false
    }
  },
  {
    productId: "smoke-bubble-matcha-028",
    productName: "Smoke Bubble Matcha",
    description: "Theatrical matcha served with aromatic smoke bubble.",
    basePrice: 50000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["hot", "ice"],
    availableSizes: ["large"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: true
    }
  },
  {
    productId: "crystal-matcha-029",
    productName: "Crystal Clear Matcha",
    description: "Transparent matcha using molecular gastronomy.",
    basePrice: 47000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["ice"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: true,
      sweet: false,
      note: true
    }
  },
  {
    productId: "levitating-matcha-030",
    productName: "Levitating Matcha Sphere",
    description: "Gravity-defying matcha presentation experience.",
    basePrice: 60000,
    imageUrl: "/images/card-menu.png",
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
    productId: "winter-spice-matcha-031",
    productName: "Winter Spice Matcha",
    description: "Warming spices of cinnamon and cardamom with matcha.",
    basePrice: 26000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["hot"],
    availableSizes: ["regular", "large"],
    customizable: {
      iceCube: false,
      sweet: true,
      note: true
    }
  },
  {
    productId: "pumpkin-matcha-032",
    productName: "Pumpkin Spice Matcha",
    description: "Autumn pumpkin puree blended with earthy matcha.",
    basePrice: 28000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["hot", "ice"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: false
    }
  },
  {
    productId: "cranberry-matcha-033",
    productName: "Cranberry Matcha Tart",
    description: "Tart cranberry balanced with smooth matcha sweetness.",
    basePrice: 25000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["ice"],
    availableSizes: ["regular", "large"],
    customizable: {
      iceCube: true,
      sweet: false,
      note: true
    }
  },
  {
    productId: "gingerbread-matcha-034",
    productName: "Gingerbread Matcha Cookie",
    description: "Holiday gingerbread flavors meet traditional matcha.",
    basePrice: 30000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["hot"],
    availableSizes: ["large"],
    customizable: {
      iceCube: false,
      sweet: true,
      note: true
    }
  },
  {
    productId: "mint-chocolate-matcha-035",
    productName: "Mint Chocolate Matcha",
    description: "Cool mint and rich chocolate layered with matcha.",
    basePrice: 29000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["ice"],
    availableSizes: ["regular", "large"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: false
    }
  },
  {
    productId: "elderflower-matcha-036",
    productName: "Elderflower Matcha Spring",
    description: "Delicate elderflower essence with fresh matcha notes.",
    basePrice: 31000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["ice"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: true,
      sweet: false,
      note: true
    }
  },
  {
    productId: "watermelon-matcha-037",
    productName: "Watermelon Matcha Cooler",
    description: "Refreshing summer watermelon with cooling matcha.",
    basePrice: 24000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["ice"],
    availableSizes: ["large"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: true
    }
  },
  {
    productId: "peach-matcha-038",
    productName: "Peach Blossom Matcha",
    description: "Sweet summer peaches harmonized with matcha green.",
    basePrice: 27000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["ice"],
    availableSizes: ["regular", "large"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: false
    }
  },
  {
    productId: "fig-matcha-039",
    productName: "Fresh Fig Matcha",
    description: "Mediterranean figs paired with Japanese matcha tradition.",
    basePrice: 33000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["hot", "ice"],
    availableSizes: ["regular"],
    customizable: {
      iceCube: true,
      sweet: false,
      note: true
    }
  },
  {
    productId: "pomegranate-matcha-040",
    productName: "Pomegranate Matcha Antioxidant",
    description: "Superfood pomegranate seeds with antioxidant-rich matcha.",
    basePrice: 32000,
    imageUrl: "/images/card-menu.png",
    availableTypes: ["ice"],
    availableSizes: ["regular", "large"],
    customizable: {
      iceCube: true,
      sweet: true,
      note: true
    }
  }
];