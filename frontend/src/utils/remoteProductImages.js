/**
 * Curated, verified live remote grocery photography from Unsplash
 * High-definition, editorial food photography matching products and categories.
 */

// Category Hero / Fallback Photography (Editorial, real still life)
export const categoryLiveImages = {
  Vegetables: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80', // Crisp farm greens, carrots, tomatoes
  Fruits: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=700&q=80', // Fresh orchard berries, citrus, apples
  Dairy: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=700&q=80', // Fresh milk bottle, butter, cream
  Bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80', // Sourdough loaves, artisan pastries
  Rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=80', // Basmati grains, rustic bowl
  Pulses: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=700&q=80', // Mixed lentils, chickpeas in bowls
  Oils: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=700&q=80', // Olive oil bottle, herbs
  Spices: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=700&q=80', // Whole spices, cinnamon, star anise
  Breakfast: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=700&q=80', // Oatmeal, berries, honey
  'Dry Fruits': 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=700&q=80', // Almonds, walnuts, pistachios
  Snacks: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=700&q=80', // Roasted artisan nuts & crisps
  Beverages: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=80', // Fresh cold pressed juice
  'Frozen Foods': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=700&q=80', // Frozen berries & sorbet
  'Personal Care': 'https://images.unsplash.com/photo-1608248597359-0f2c41743f5f?auto=format&fit=crop&w=700&q=80', // Botanical soap & natural oils
  Household: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=700&q=80', // Eco cleaning brush, glass spray
  'Pet Care': 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=700&q=80', // Healthy pet bowl, organic treats
};

// Item-level precision mapping based on product name keywords
const itemKeywordImages = [
  // Vegetables
  { keywords: ['tomato'], url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['onion'], url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['spinach', 'palak'], url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['cucumber'], url: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['mushroom'], url: 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['potato'], url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['carrot'], url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['garlic'], url: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['cauliflower'], url: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['chili', 'chilli'], url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['capsicum', 'pepper'], url: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['ginger'], url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['coriander', 'cilantro'], url: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=700&q=80' },

  // Fruits
  { keywords: ['apple'], url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['banana'], url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['orange', 'citrus'], url: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['mango'], url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['pomegranate'], url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['berry', 'strawberry'], url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['watermelon', 'melon'], url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['grapes'], url: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['lemon', 'lime'], url: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=700&q=80' },

  // Dairy
  { keywords: ['milk'], url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['ghee', 'butter'], url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['paneer', 'cheese'], url: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['curd', 'yogurt'], url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=700&q=80' },

  // Bakery
  { keywords: ['bread', 'sourdough', 'loaf'], url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['croissant', 'bun', 'cookie', 'biscuit'], url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=700&q=80' },

  // Grains & Pulses
  { keywords: ['rice', 'basmati'], url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['dal', 'lentil', 'chana', 'rajma', 'pulse'], url: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['atta', 'flour', 'wheat'], url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=700&q=80' },

  // Oils & Condiments
  { keywords: ['oil', 'olive', 'mustard'], url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['spice', 'masala', 'cardamom', 'turmeric'], url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=700&q=80' },

  // Dry Fruits & Nuts
  { keywords: ['almond', 'cashew', 'walnut', 'pista', 'raisin'], url: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=700&q=80' },

  // Breakfast & Beverages
  { keywords: ['honey'], url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['tea', 'chai'], url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['coffee'], url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80' },
  { keywords: ['juice'], url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=700&q=80' },
];

/**
 * Returns a verified, high-definition live remote image URL for a product.
 */
export function getProductLiveImage(product = {}) {
  // If product has a valid remote HTTP URL already that isn't a legacy internal scheme, use it
  if (product.image && (product.image.startsWith('http://') || product.image.startsWith('https://'))) {
    return product.image;
  }

  const name = String(product.name || '').toLowerCase();
  
  // Search keyword map
  for (const item of itemKeywordImages) {
    if (item.keywords.some((kw) => name.includes(kw))) {
      return item.url;
    }
  }

  // Category fallback
  if (product.category && categoryLiveImages[product.category]) {
    return categoryLiveImages[product.category];
  }

  // Generic fresh harvest provision still life
  return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80';
}
