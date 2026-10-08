const express = require('express');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const router = express.Router();

let productCache = {
  expiresAt: 0,
  products: [],
};

const categoryRoutes = {
  rice: 'Rice',
  pulses: 'Pulses',
  vegetables: 'Vegetables',
  fruits: 'Fruits',
  dairy: 'Dairy',
  bakery: 'Bakery',
  oils: 'Oils',
  spices: 'Spices',
  breakfast: 'Breakfast',
  'dry-fruits': 'Dry Fruits',
  snacks: 'Snacks',
  beverages: 'Beverages',
  'frozen-foods': 'Frozen Foods',
  'personal-care': 'Personal Care',
  household: 'Household',
  'pet-care': 'Pet Care',
};

const getPublicProducts = async () => {
  if (Date.now() < productCache.expiresAt && productCache.products.length) {
    return productCache.products;
  }

  const products = await ensureCuratedCatalog();
  productCache = {
    expiresAt: Date.now() + 15 * 60 * 1000,
    products,
  };
  return products;
};

const getCategoryProducts = async (category) => {
  return ensureCategoryCatalog(category);
};

router.get('/', asyncHandler(async (req, res) => {
  const products = await getPublicProducts();
  const { category } = req.query;

  if (category && category !== 'All') {
    res.json(products.filter((product) => product.category === category));
    return;
  }

  res.json(products);
}));

router.get('/categories', (req, res) => {
  res.json(Object.entries(categoryRoutes).map(([slug, name]) => ({
    slug,
    name,
    endpoint: `/api/products/${slug}`,
  })));
});

router.get('/:categorySlug', asyncHandler(async (req, res, next) => {
  const category = categoryRoutes[req.params.categorySlug];

  if (!category) {
    next();
    return;
  }

  const products = await getCategoryProducts(category);
  res.json(products);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
    return res.status(404).json({ message: 'Product not found' });
  }
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
}));

const seedData = [
  // RICE & GRAINS (15)
  { externalId: 's-rice-1', name: 'Premium Basmati Rice', price: 180, category: 'Rice', unit: '1kg', brand: 'GreenBasket', image: '', description: 'Long-grain aged basmati rice.' },
  { externalId: 's-rice-2', name: 'Organic Brown Rice', price: 120, category: 'Rice', unit: '1kg', brand: 'GreenBasket', image: '', description: 'Whole grain brown rice.' },
  { externalId: 's-rice-3', name: 'Jasmine Fragrant Rice', price: 150, category: 'Rice', unit: '1kg', brand: 'GreenBasket', image: '', description: 'Aromatic jasmine rice.' },
  { externalId: 's-rice-4', name: 'Sona Masoori Rice', price: 90, category: 'Rice', unit: '5kg', brand: 'GreenBasket', image: '', description: 'Lightweight and aromatic medium-grain rice.' },
  { externalId: 's-rice-5', name: 'Organic Quinoa', price: 350, category: 'Rice', unit: '500g', brand: 'GreenBasket', image: '', description: 'Protein-rich superfood grain.' },
  { externalId: 's-rice-6', name: 'Black Forbidden Rice', price: 220, category: 'Rice', unit: '500g', brand: 'GreenBasket', image: '', description: 'Nutrient-dense heirloom rice.' },
  { externalId: 's-rice-7', name: 'Arborio Risotto Rice', price: 190, category: 'Rice', unit: '1kg', brand: 'GreenBasket', image: '', description: 'High-starch rice for creamy risotto.' },
  { externalId: 's-rice-8', name: 'Red Matta Rice', price: 110, category: 'Rice', unit: '1kg', brand: 'GreenBasket', image: '', description: 'Traditional Kerala red rice.' },
  { externalId: 's-rice-9', name: 'Wild Rice Mix', price: 280, category: 'Rice', unit: '500g', brand: 'GreenBasket', image: '', description: 'Blend of wild and long-grain rice.' },
  { externalId: 's-rice-10', name: 'Poha (Flattened Rice)', price: 55, category: 'Rice', unit: '1kg', brand: 'GreenBasket', image: '', description: 'Thick beaten rice for breakfast.' },
  { externalId: 's-rice-11', name: 'Idli Rice', price: 75, category: 'Rice', unit: '1kg', brand: 'GreenBasket', image: '', description: 'Short-grain rice for idli batter.' },
  { externalId: 's-rice-12', name: 'Bulgur Wheat', price: 130, category: 'Rice', unit: '500g', brand: 'GreenBasket', image: '', description: 'Cracked wheat for tabbouleh.' },
  { externalId: 's-rice-13', name: 'Couscous', price: 145, category: 'Rice', unit: '500g', brand: 'GreenBasket', image: '', description: 'Semolina pearls for Mediterranean dishes.' },
  { externalId: 's-rice-14', name: 'Pearl Millet (Bajra)', price: 65, category: 'Rice', unit: '1kg', brand: 'GreenBasket', image: '', description: 'Ancient grain rich in minerals.' },
  { externalId: 's-rice-15', name: 'Finger Millet (Ragi)', price: 70, category: 'Rice', unit: '1kg', brand: 'GreenBasket', image: '', description: 'Calcium-rich millet for porridge.' },

  // PULSES & LENTILS (15)
  { externalId: 's-pul-1', name: 'Yellow Moong Dal', price: 95, category: 'Pulses', unit: '500g', brand: 'GreenBasket', image: '', description: 'Unpolished yellow moong dal.' },
  { externalId: 's-pul-2', name: 'Red Masoor Dal', price: 85, category: 'Pulses', unit: '500g', brand: 'GreenBasket', image: '', description: 'Whole red lentils.' },
  { externalId: 's-pul-3', name: 'Chana Dal', price: 75, category: 'Pulses', unit: '500g', brand: 'GreenBasket', image: '', description: 'Split chickpeas.' },
  { externalId: 's-pul-4', name: 'Urad Dal White', price: 110, category: 'Pulses', unit: '500g', brand: 'GreenBasket', image: '', description: 'Skinned white lentils.' },
  { externalId: 's-pul-5', name: 'Toor Dal Premium', price: 125, category: 'Pulses', unit: '1kg', brand: 'GreenBasket', image: '', description: 'Arhar dal for daily sample.' },
  { externalId: 's-pul-6', name: 'Black Urad Dal Whole', price: 95, category: 'Pulses', unit: '500g', brand: 'GreenBasket', image: '', description: 'Whole black gram for Dal Makhani.' },
  { externalId: 's-pul-7', name: 'Kabuli Chana (Chickpeas)', price: 140, category: 'Pulses', unit: '1kg', brand: 'GreenBasket', image: '', description: 'Large white chickpeas.' },
  { externalId: 's-pul-8', name: 'Rajma Chitra', price: 160, category: 'Pulses', unit: '1kg', brand: 'GreenBasket', image: '', description: 'Spotted kidney beans.' },
  { externalId: 's-pul-9', name: 'Green Moong Whole', price: 105, category: 'Pulses', unit: '500g', brand: 'GreenBasket', image: '', description: 'Whole green moong beans.' },
  { externalId: 's-pul-10', name: 'Black Eyed Beans (Lobia)', price: 90, category: 'Pulses', unit: '500g', brand: 'GreenBasket', image: '', description: 'High-protein black eyed peas.' },
  { externalId: 's-pul-11', name: 'Soyabean Chunks', price: 65, category: 'Pulses', unit: '200g', brand: 'GreenBasket', image: '', description: 'Vegetarian protein chunks.' },
  { externalId: 's-pul-12', name: 'Moth Beans', price: 115, category: 'Pulses', unit: '500g', brand: 'GreenBasket', image: '', description: 'Traditional Indian sprout beans.' },
  { externalId: 's-pul-13', name: 'Horse Gram (Kulthi)', price: 80, category: 'Pulses', unit: '500g', brand: 'GreenBasket', image: '', description: 'Superfood lentil for weight loss.' },
  { externalId: 's-pul-14', name: 'Green Peas Dry', price: 70, category: 'Pulses', unit: '500g', brand: 'GreenBasket', image: '', description: 'Dried whole green peas.' },
  { externalId: 's-pul-15', name: 'Val Dal (Field Beans)', price: 130, category: 'Pulses', unit: '500g', brand: 'GreenBasket', image: '', description: 'Traditional broad beans.' },

  // VEGETABLES (15)
  { externalId: 's-veg-1', name: 'Fresh Roma Tomatoes', price: 40, category: 'Vegetables', unit: '1kg', brand: 'GreenBasket', image: '', description: 'Firm Roma tomatoes.' },
  { externalId: 's-veg-2', name: 'Organic Red Onions', price: 35, category: 'Vegetables', unit: '1kg', brand: 'GreenBasket', image: '', description: 'Crisp red onions.' },
  { externalId: 's-veg-3', name: 'Fresh Baby Spinach', price: 30, category: 'Vegetables', unit: '250g', brand: 'GreenBasket', image: '', description: 'Tender baby spinach.' },
  { externalId: 's-veg-4', name: 'English Cucumber', price: 45, category: 'Vegetables', unit: '1pc', brand: 'GreenBasket', image: '', description: 'Seedless crisp cucumber.' },
  { externalId: 's-veg-5', name: 'Bell Pepper Trio', price: 120, category: 'Vegetables', unit: '500g', brand: 'GreenBasket', image: '', description: 'Red, yellow and green peppers.' },
  { externalId: 's-veg-6', name: 'Broccoli Florets', price: 90, category: 'Vegetables', unit: '250g', brand: 'GreenBasket', image: '', description: 'Fresh nutrient-rich broccoli.' },
  { externalId: 's-veg-7', name: 'Sweet Corn Cobs', price: 50, category: 'Vegetables', unit: '2pcs', brand: 'GreenBasket', image: '', description: 'Farm fresh sweet corn.' },
  { externalId: 's-veg-8', name: 'Purple Eggplant', price: 40, category: 'Vegetables', unit: '500g', brand: 'GreenBasket', image: '', description: 'Glossy fresh eggplants.' },
  { externalId: 's-veg-9', name: 'Ginger Root', price: 25, category: 'Vegetables', unit: '100g', brand: 'GreenBasket', image: '', description: 'Pungent fresh ginger.' },
  { externalId: 's-veg-10', name: 'Green Chilies', price: 15, category: 'Vegetables', unit: '100g', brand: 'GreenBasket', image: '', description: 'Spicy fresh chilies.' },
  { externalId: 's-veg-11', name: 'Cauliflower', price: 45, category: 'Vegetables', unit: '1pc', brand: 'GreenBasket', image: '', description: 'Compact white cauliflower.' },
  { externalId: 's-veg-12', name: 'Carrots Orange', price: 60, category: 'Vegetables', unit: '1kg', brand: 'GreenBasket', image: '', description: 'Crunchy orange carrots.' },
  { externalId: 's-veg-13', name: 'Potato (New Crop)', price: 30, category: 'Vegetables', unit: '1kg', brand: 'GreenBasket', image: '', description: 'Fresh mud-free potatoes.' },
  { externalId: 's-veg-14', name: 'Garlic Bulbs', price: 50, category: 'Vegetables', unit: '250g', brand: 'GreenBasket', image: '', description: 'Strong aromatic garlic.' },
  { externalId: 's-veg-15', name: 'Mushrooms Button', price: 55, category: 'Vegetables', unit: '200g', brand: 'GreenBasket', image: '', description: 'Fresh white button mushrooms.' },

  // FRUITS (15)
  { externalId: 's-fru-1', name: 'Royal Gala Apples', price: 180, category: 'Fruits', unit: '1kg', brand: 'GreenBasket', image: '', description: 'Sweet crunchy Gala apples.' },
  { externalId: 's-fru-2', name: 'Fresh Cavendish Bananas', price: 60, category: 'Fruits', unit: '1 dozen', brand: 'GreenBasket', image: '', description: 'Ripe yellow bananas.' },
  { externalId: 's-fru-3', name: 'Alphonso Mangoes', price: 850, category: 'Fruits', unit: '1 dozen', brand: 'GreenBasket', image: '', description: 'Premium king of mangoes.' },
  { externalId: 's-fru-4', name: 'Hass Avocados', price: 290, category: 'Fruits', unit: '2pcs', brand: 'GreenBasket', image: '', description: 'Creamy ripe avocados.' },
  { externalId: 's-fru-5', name: 'Green Seedless Grapes', price: 140, category: 'Fruits', unit: '500g', brand: 'GreenBasket', image: '', description: 'Sweet green grapes.' },
  { externalId: 's-fru-6', name: 'Pomegranate Premium', price: 190, category: 'Fruits', unit: '1kg', brand: 'GreenBasket', image: '', description: 'Juicy red pomegranates.' },
  { externalId: 's-fru-7', name: 'Fresh Oranges', price: 110, category: 'Fruits', unit: '1kg', brand: 'GreenBasket', image: '', description: 'Sweet and tangy oranges.' },
  { externalId: 's-fru-8', name: 'Kiwi Fruit', price: 130, category: 'Fruits', unit: '3pcs', brand: 'GreenBasket', image: '', description: 'Nutrient dense kiwis.' },
  { externalId: 's-fru-9', name: 'Red Cherries', price: 450, category: 'Fruits', unit: '250g', brand: 'GreenBasket', image: '', description: 'Fresh sweet cherries.' },
  { externalId: 's-fru-10', name: 'Blueberries', price: 380, category: 'Fruits', unit: '125g', brand: 'GreenBasket', image: '', description: 'Fresh antioxidant berries.' },
  { externalId: 's-fru-11', name: 'Watermelon Whole', price: 90, category: 'Fruits', unit: '1pc', brand: 'GreenBasket', image: '', description: 'Juicy large watermelon.' },
  { externalId: 's-fru-12', name: 'Papaya Semi-Ripe', price: 70, category: 'Fruits', unit: '1pc', brand: 'GreenBasket', image: '', description: 'Sweet digestive fruit.' },
  { externalId: 's-fru-13', name: 'Pineapple Queen', price: 100, category: 'Fruits', unit: '1pc', brand: 'GreenBasket', image: '', description: 'Fresh thorny pineapple.' },
  { externalId: 's-fru-14', name: 'Plums Red', price: 160, category: 'Fruits', unit: '500g', brand: 'GreenBasket', image: '', description: 'Sweet and tart plums.' },
  { externalId: 's-fru-15', name: 'Pears Nashpati', price: 140, category: 'Fruits', unit: '1kg', brand: 'GreenBasket', image: '', description: 'Crunchy local pears.' },

  // DAIRY (15)
  { externalId: 's-dai-1', name: 'Full Cream Fresh Milk', price: 65, category: 'Dairy', unit: '1L', brand: 'GreenBasket', image: '', description: 'Pasteurized rich milk.' },
  { externalId: 's-dai-2', name: 'Greek Plain Yogurt', price: 45, category: 'Dairy', unit: '200g', brand: 'GreenBasket', image: '', description: 'Thick creamy yogurt.' },
  { externalId: 's-dai-3', name: 'Salted Farm Butter', price: 240, category: 'Dairy', unit: '500g', brand: 'GreenBasket', image: '', description: 'Delicious cream butter.' },
  { externalId: 's-dai-4', name: 'Paneer (Cottage Cheese)', price: 95, category: 'Dairy', unit: '200g', brand: 'GreenBasket', image: '', description: 'Fresh soft paneer blocks.' },
  { externalId: 's-dai-5', name: 'Cheddar Cheese Slices', price: 160, category: 'Dairy', unit: '200g', brand: 'GreenBasket', image: '', description: 'Smooth cheddar slices.' },
  { externalId: 's-dai-6', name: 'Fresh Mozzarella', price: 220, category: 'Dairy', unit: '200g', brand: 'GreenBasket', image: '', description: 'Soft cheese for pizza.' },
  { externalId: 's-dai-7', name: 'Low Fat Skimmed Milk', price: 60, category: 'Dairy', unit: '1L', brand: 'GreenBasket', image: '', description: 'Healthy low calorie milk.' },
  { externalId: 's-dai-8', name: 'Strawberry Milkshake', price: 35, category: 'Dairy', unit: '200ml', brand: 'GreenBasket', image: '', description: 'Sweet fruity milk drink.' },
  { externalId: 's-dai-9', name: 'Condensed Milk', price: 145, category: 'Dairy', unit: '400g', brand: 'GreenBasket', image: '', description: 'Sweet milk for desserts.' },
  { externalId: 's-dai-10', name: 'Fresh Whipping Cream', price: 180, category: 'Dairy', unit: '250ml', brand: 'GreenBasket', image: '', description: 'Cream for cakes and fruit.' },
  { externalId: 's-dai-11', name: 'Probiotic Curd', price: 50, category: 'Dairy', unit: '400g', brand: 'GreenBasket', image: '', description: 'Gut friendly fresh curd.' },
  { externalId: 's-dai-12', name: 'Clarified Butter (Ghee)', price: 650, category: 'Dairy', unit: '1L', brand: 'GreenBasket', image: '', description: 'Pure cow ghee.' },
  { externalId: 's-dai-13', name: 'Blue Cheese', price: 450, category: 'Dairy', unit: '100g', brand: 'GreenBasket', image: '', description: 'Aromatic gourmet cheese.' },
  { externalId: 's-dai-14', name: 'Oat Milk (Dairy Free)', price: 290, category: 'Dairy', unit: '1L', brand: 'GreenBasket', image: '', description: 'Vegan milk alternative.' },
  { externalId: 's-dai-15', name: 'Flavored Greek Yogurt', price: 55, category: 'Dairy', unit: '100g', brand: 'GreenBasket', image: '', description: 'Blueberry greek yogurt.' },

  // BAKERY (15)
  { externalId: 's-bak-1', name: 'Whole Wheat Sourdough', price: 85, category: 'Bakery', unit: '400g', brand: 'GreenBasket', image: '', description: 'Crusty sourdough bread.' },
  { externalId: 's-bak-2', name: 'Chocolate Chip Cookies', price: 120, category: 'Bakery', unit: '200g', brand: 'GreenBasket', image: '', description: 'Chewy Belgian choc cookies.' },
  { externalId: 's-bak-3', name: 'Butter Croissants', price: 150, category: 'Bakery', unit: '2pcs', brand: 'GreenBasket', image: '', description: 'Flaky French butter pastries.' },
  { externalId: 's-bak-4', name: 'Multigrain Brown Bread', price: 50, category: 'Bakery', unit: '400g', brand: 'GreenBasket', image: '', description: 'Healthy high fiber bread.' },
  { externalId: 's-bak-5', name: 'Blueberry Muffins', price: 180, category: 'Bakery', unit: '2pcs', brand: 'GreenBasket', image: '', description: 'Soft muffins with real berries.' },
  { externalId: 's-bak-6', name: 'Garlic Breadsticks', price: 75, category: 'Bakery', unit: '1pk', brand: 'GreenBasket', image: '', description: 'Aromatic garlic buttery sticks.' },
  { externalId: 's-bak-7', name: 'Red Velvet Cake', price: 450, category: 'Bakery', unit: '500g', brand: 'GreenBasket', image: '', description: 'Premium celebration cake.' },
  { externalId: 's-bak-8', name: 'Pita Bread Whole Wheat', price: 65, category: 'Bakery', unit: '3pcs', brand: 'GreenBasket', image: '', description: 'Soft pita for hummus.' },
  { externalId: 's-bak-9', name: 'Oatmeal Raisin Cookies', price: 130, category: 'Bakery', unit: '200g', brand: 'GreenBasket', image: '', description: 'Classic healthy cookies.' },
  { externalId: 's-bak-10', name: 'Bagel Plain', price: 90, category: 'Bakery', unit: '2pcs', brand: 'GreenBasket', image: '', description: 'Dense chewy bagels.' },
  { externalId: 's-bak-11', name: 'Apple Pie Slice', price: 85, category: 'Bakery', unit: '1pc', brand: 'GreenBasket', image: '', description: 'Sweet spiced apple tart.' },
  { externalId: 's-bak-12', name: 'Burger Buns Sesame', price: 40, category: 'Bakery', unit: '4pcs', brand: 'GreenBasket', image: '', description: 'Soft buns for burgers.' },
  { externalId: 's-bak-13', name: 'Dinner Rolls', price: 35, category: 'Bakery', unit: '6pcs', brand: 'GreenBasket', image: '', description: 'Soft rolls for meals.' },
  { externalId: 's-bak-14', name: 'Fruit Cake Bar', price: 110, category: 'Bakery', unit: '250g', brand: 'GreenBasket', image: '', description: 'Cake with dried fruits.' },
  { externalId: 's-bak-15', name: 'Chocolate Donuts', price: 95, category: 'Bakery', unit: '2pcs', brand: 'GreenBasket', image: '', description: 'Glazed chocolate donuts.' },

  // OILS (15)
  { externalId: 's-oil-1', name: 'Extra Virgin Olive Oil', price: 850, category: 'Oils', unit: '1L', brand: 'GreenBasket', image: '', description: 'Cold pressed olive oil.' },
  { externalId: 's-oil-2', name: 'Cold Pressed Mustard Oil', price: 190, category: 'Oils', unit: '1L', brand: 'GreenBasket', image: '', description: 'Traditional pungent oil.' },
  { externalId: 's-oil-3', name: 'Sunflower Refined Oil', price: 145, category: 'Oils', unit: '1L', brand: 'GreenBasket', image: '', description: 'Light cooking oil.' },
  { externalId: 's-oil-4', name: 'Groundnut Cold Pressed Oil', price: 280, category: 'Oils', unit: '1L', brand: 'GreenBasket', image: '', description: 'Healthy peanut oil.' },
  { externalId: 's-oil-5', name: 'Rice Bran Oil', price: 165, category: 'Oils', unit: '1L', brand: 'GreenBasket', image: '', description: 'Heart healthy oil.' },
  { externalId: 's-oil-6', name: 'Coconut Cooking Oil', price: 210, category: 'Oils', unit: '500ml', brand: 'GreenBasket', image: '', description: 'Pure coconut edible oil.' },
  { externalId: 's-oil-7', name: 'Sesame Oil (Gingelly)', price: 320, category: 'Oils', unit: '1L', brand: 'GreenBasket', image: '', description: 'Traditional sesame oil.' },
  { externalId: 's-oil-8', name: 'Avocado Oil', price: 1200, category: 'Oils', unit: '500ml', brand: 'GreenBasket', image: '', description: 'Premium high-smoke oil.' },
  { externalId: 's-oil-9', name: 'Canola Oil', price: 220, category: 'Oils', unit: '1L', brand: 'GreenBasket', image: '', description: 'Light multipurpose oil.' },
  { externalId: 's-oil-10', name: 'Castor Oil Pure', price: 95, category: 'Oils', unit: '100ml', brand: 'GreenBasket', image: '', description: 'Pure medicinal castor oil.' },
  { externalId: 's-oil-11', name: 'Grapeseed Oil', price: 980, category: 'Oils', unit: '500ml', brand: 'GreenBasket', image: '', description: 'Light neutral cooking oil.' },
  { externalId: 's-oil-12', name: 'Flaxseed Oil', price: 450, category: 'Oils', unit: '250ml', brand: 'GreenBasket', image: '', description: 'Omega-3 rich healthy oil.' },
  { externalId: 's-oil-13', name: 'Soybean Refined Oil', price: 135, category: 'Oils', unit: '1L', brand: 'GreenBasket', image: '', description: 'Daily cooking soya oil.' },
  { externalId: 's-oil-14', name: 'Corn Oil Premium', price: 180, category: 'Oils', unit: '1L', brand: 'GreenBasket', image: '', description: 'Pure corn germ oil.' },
  { externalId: 's-oil-15', name: 'Walnut Oil', price: 1500, category: 'Oils', unit: '250ml', brand: 'GreenBasket', image: '', description: 'Nutty gourmet oil.' },

  // SPICES (15)
  { externalId: 's-spi-1', name: 'Organic Turmeric Powder', price: 45, category: 'Spices', unit: '100g', brand: 'GreenBasket', image: '', description: 'Pure turmeric powder.' },
  { externalId: 's-spi-2', name: 'Whole Black Peppercorns', price: 80, category: 'Spices', unit: '50g', brand: 'GreenBasket', image: '', description: 'Aromatic black pepper.' },
  { externalId: 's-spi-3', name: 'Red Chili Powder (Lal Mirch)', price: 65, category: 'Spices', unit: '200g', brand: 'GreenBasket', image: '', description: 'Spicy red chili powder.' },
  { externalId: 's-spi-4', name: 'Cumin Seeds (Jeera)', price: 90, category: 'Spices', unit: '100g', brand: 'GreenBasket', image: '', description: 'Aromatic cumin seeds.' },
  { externalId: 's-spi-5', name: 'Coriander Powder (Dhania)', price: 55, category: 'Spices', unit: '200g', brand: 'GreenBasket', image: '', description: 'Ground coriander seeds.' },
  { externalId: 's-spi-6', name: 'Green Cardamom (Elaichi)', price: 250, category: 'Spices', unit: '50g', brand: 'GreenBasket', image: '', description: 'Premium whole cardamom.' },
  { externalId: 's-spi-7', name: 'Cloves (Laung)', price: 120, category: 'Spices', unit: '50g', brand: 'GreenBasket', image: '', description: 'Strong whole cloves.' },
  { externalId: 's-spi-8', name: 'Cinnamon Sticks', price: 110, category: 'Spices', unit: '50g', brand: 'GreenBasket', image: '', description: 'Whole cinnamon quills.' },
  { externalId: 's-spi-9', name: 'Garam Masala', price: 95, category: 'Spices', unit: '100g', brand: 'GreenBasket', image: '', description: 'Traditional spice blend.' },
  { externalId: 's-spi-10', name: 'Saffron (Kesar)', price: 350, category: 'Spices', unit: '1g', brand: 'GreenBasket', image: '', description: 'Pure Kashmiri saffron.' },
  { externalId: 's-spi-11', name: 'Star Anise', price: 75, category: 'Spices', unit: '25g', brand: 'GreenBasket', image: '', description: 'Whole star anise pods.' },
  { externalId: 's-spi-12', name: 'Bay Leaves (Tejpatta)', price: 30, category: 'Spices', unit: '20g', brand: 'GreenBasket', image: '', description: 'Dried aromatic leaves.' },
  { externalId: 's-spi-13', name: 'Nutmeg Whole', price: 60, category: 'Spices', unit: '2pcs', brand: 'GreenBasket', image: '', description: 'Whole nutmeg seeds.' },
  { externalId: 's-spi-14', name: 'Black Salt Powder', price: 40, category: 'Spices', unit: '100g', brand: 'GreenBasket', image: '', description: 'Tangy black rock salt.' },
  { externalId: 's-spi-15', name: 'Fenugreek Seeds (Methi)', price: 50, category: 'Spices', unit: '100g', brand: 'GreenBasket', image: '', description: 'Bitter whole methi seeds.' },

  // BREAKFAST (15)
  { externalId: 's-bre-1', name: 'Rolled Oats', price: 160, category: 'Breakfast', unit: '1kg', brand: 'GreenBasket', image: '', description: 'Whole grain rolled oats.' },
  { externalId: 's-bre-2', name: 'Honey Nut Muesli', price: 280, category: 'Breakfast', unit: '500g', brand: 'GreenBasket', image: '', description: 'Crunchy fruit muesli.' },
  { externalId: 's-bre-3', name: 'Corn Flakes Original', price: 190, category: 'Breakfast', unit: '475g', brand: 'GreenBasket', image: '', description: 'Classic toasted corn cereal.' },
  { externalId: 's-bre-4', name: 'Chocos Cereal', price: 210, category: 'Breakfast', unit: '375g', brand: 'GreenBasket', image: '', description: 'Chocolatey wheat scoops.' },
  { externalId: 's-bre-5', name: 'Peanut Butter Creamy', price: 180, category: 'Breakfast', unit: '340g', brand: 'GreenBasket', image: '', description: 'Smooth peanut spread.' },
  { externalId: 's-bre-6', name: 'Fruit Jam Mixed', price: 140, category: 'Breakfast', unit: '500g', brand: 'GreenBasket', image: '', description: 'Sweet fruit jam.' },
  { externalId: 's-bre-7', name: 'Instant Upma Mix', price: 65, category: 'Breakfast', unit: '200g', brand: 'GreenBasket', image: '', description: 'Easy cook breakfast mix.' },
  { externalId: 's-bre-8', name: 'Honey Pure Natural', price: 240, category: 'Breakfast', unit: '500g', brand: 'GreenBasket', image: '', description: '100% pure honey.' },
  { externalId: 's-bre-9', name: 'Granola Bars Assorted', price: 150, category: 'Breakfast', unit: '6pcs', brand: 'GreenBasket', image: '', description: 'Healthy snacking bars.' },
  { externalId: 's-bre-10', name: 'Vermicelli Roasted', price: 45, category: 'Breakfast', unit: '450g', brand: 'GreenBasket', image: '', description: 'Roasted wheat vermicelli.' },
  { externalId: 's-bre-11', name: 'Maple Syrup', price: 850, category: 'Breakfast', unit: '250ml', brand: 'GreenBasket', image: '', description: 'Pure Canadian maple syrup.' },
  { externalId: 's-bre-12', name: 'Pancake Mix', price: 160, category: 'Breakfast', unit: '500g', brand: 'GreenBasket', image: '', description: 'Instant fluffy pancake mix.' },
  { externalId: 's-bre-13', name: 'Chia Seeds Organic', price: 320, category: 'Breakfast', unit: '200g', brand: 'GreenBasket', image: '', description: 'Healthy superfood seeds.' },
  { externalId: 's-bre-14', name: 'Chocolate Hazelnut Spread', price: 380, category: 'Breakfast', unit: '350g', brand: 'GreenBasket', image: '', description: 'Creamy hazelnut spread.' },
  { externalId: 's-bre-15', name: 'Idli Podi (Gunpowder)', price: 75, category: 'Breakfast', unit: '100g', brand: 'GreenBasket', image: '', description: 'Spicy lentil dip powder.' },

  // DRY FRUITS (15)
  { externalId: 's-dry-1', name: 'California Almonds', price: 450, category: 'Dry Fruits', unit: '500g', brand: 'GreenBasket', image: '', description: 'Crunchy premium almonds.' },
  { externalId: 's-dry-2', name: 'Whole Cashew Nuts', price: 480, category: 'Dry Fruits', unit: '500g', brand: 'GreenBasket', image: '', description: 'Creamy large cashews.' },
  { externalId: 's-dry-3', name: 'Shelled Walnuts', price: 650, category: 'Dry Fruits', unit: '250g', brand: 'GreenBasket', image: '', description: 'Brain boosting walnut halves.' },
  { externalId: 's-dry-4', name: 'Pistachios Roasted', price: 580, category: 'Dry Fruits', unit: '250g', brand: 'GreenBasket', image: '', description: 'Salted roasted pistachios.' },
  { externalId: 's-dry-5', name: 'Dried Raisins (Kishmish)', price: 150, category: 'Dry Fruits', unit: '250g', brand: 'GreenBasket', image: '', description: 'Sweet green raisins.' },
  { externalId: 's-dry-6', name: 'Dried Dates (Khajoor)', price: 210, category: 'Dry Fruits', unit: '500g', brand: 'GreenBasket', image: '', description: 'Natural sweet seeded dates.' },
  { externalId: 's-dry-7', name: 'Anjeer (Dried Figs)', price: 850, category: 'Dry Fruits', unit: '250g', brand: 'GreenBasket', image: '', description: 'Soft premium dried figs.' },
  { externalId: 's-dry-8', name: 'Apricots Dried', price: 420, category: 'Dry Fruits', unit: '250g', brand: 'GreenBasket', image: '', description: 'Tangy sweet dried apricots.' },
  { externalId: 's-dry-9', name: 'Dried Cranberries', price: 340, category: 'Dry Fruits', unit: '200g', brand: 'GreenBasket', image: '', description: 'Sweet tart cranberries.' },
  { externalId: 's-dry-10', name: 'Pecan Nuts', price: 1200, category: 'Dry Fruits', unit: '200g', brand: 'GreenBasket', image: '', description: 'Buttery premium pecans.' },
  { externalId: 's-dry-11', name: 'Brazil Nuts', price: 1500, category: 'Dry Fruits', unit: '200g', brand: 'GreenBasket', image: '', description: 'Large selenium rich nuts.' },
  { externalId: 's-dry-12', name: 'Hazelnut Shelled', price: 950, category: 'Dry Fruits', unit: '200g', brand: 'GreenBasket', image: '', description: 'Aromatic raw hazelnuts.' },
  { externalId: 's-dry-13', name: 'Pine Nuts (Chilgoza)', price: 3500, category: 'Dry Fruits', unit: '100g', brand: 'GreenBasket', image: '', description: 'Exotic wild pine nuts.' },
  { externalId: 's-dry-14', name: 'Prunes Pitted', price: 460, category: 'Dry Fruits', unit: '250g', brand: 'GreenBasket', image: '', description: 'Soft sweet pitted prunes.' },
  { externalId: 's-dry-15', name: 'Makhana (Fox Nuts)', price: 180, category: 'Dry Fruits', unit: '100g', brand: 'GreenBasket', image: '', description: 'Healthy roasted lotus seeds.' },

  // SNACKS (15)
  { externalId: 's-sna-1', name: 'Classic Potato Chips', price: 20, category: 'Snacks', unit: '50g', brand: 'GreenBasket', image: '', description: 'Crispy salted chips.' },
  { externalId: 's-sna-2', name: 'Digestive Biscuits', price: 35, category: 'Snacks', unit: '150g', brand: 'GreenBasket', image: '', description: 'Healthy multigrain biscuits.' },
  { externalId: 's-sna-3', name: 'Milk Chocolate Bar', price: 80, category: 'Snacks', unit: '100g', brand: 'GreenBasket', image: '', description: 'Smooth dairy milk.' },
  { externalId: 's-sna-4', name: 'Roasted Peanuts', price: 50, category: 'Snacks', unit: '200g', brand: 'GreenBasket', image: '', description: 'Salted crunchy peanuts.' },
  { externalId: 's-sna-5', name: 'Instant Noodles', price: 15, category: 'Snacks', unit: '70g', brand: 'GreenBasket', image: '', description: 'Favorite 2-minute noodles.' },
  { externalId: 's-sna-6', name: 'Popcorn Kernels', price: 60, category: 'Snacks', unit: '500g', brand: 'GreenBasket', image: '', description: 'Yellow corn for popping.' },
  { externalId: 's-sna-7', name: 'Tortilla Chips', price: 95, category: 'Snacks', unit: '150g', brand: 'GreenBasket', image: '', description: 'Crunchy nacho cheese chips.' },
  { externalId: 's-sna-8', name: 'Pretzels Salted', price: 120, category: 'Snacks', unit: '200g', brand: 'GreenBasket', image: '', description: 'Crunchy twisted pretzels.' },
  { externalId: 's-sna-9', name: 'Dark Chocolate 70%', price: 250, category: 'Snacks', unit: '100g', brand: 'GreenBasket', image: '', description: 'Rich bittersweet chocolate.' },
  { externalId: 's-sna-10', name: 'Gummy Bears', price: 60, category: 'Snacks', unit: '100g', brand: 'GreenBasket', image: '', description: 'Soft fruity chewy candy.' },
  { externalId: 's-sna-11', name: 'Rice Crackers', price: 85, category: 'Snacks', unit: '100g', brand: 'GreenBasket', image: '', description: 'Light crispy rice snacks.' },
  { externalId: 's-sna-12', name: 'Corn Puffs', price: 40, category: 'Snacks', unit: '75g', brand: 'GreenBasket', image: '', description: 'Spicy crunchy corn sticks.' },
  { externalId: 's-sna-13', name: 'Wafer Biscuits', price: 30, category: 'Snacks', unit: '75g', brand: 'GreenBasket', image: '', description: 'Thin crispy cream wafers.' },
  { externalId: 's-sna-14', name: 'Pistachio Biscuits', price: 45, category: 'Snacks', unit: '150g', brand: 'GreenBasket', image: '', description: 'Sweet biscuits with nuts.' },
  { externalId: 's-sna-15', name: 'Fruit & Nut Bar', price: 40, category: 'Snacks', unit: '40g', brand: 'GreenBasket', image: '', description: 'Chocolate with fruit & nuts.' },

  // BEVERAGES (15)
  { externalId: 's-bev-1', name: 'Pure Orange Juice', price: 110, category: 'Beverages', unit: '1L', brand: 'GreenBasket', image: '', description: 'No added sugar juice.' },
  { externalId: 's-bev-2', name: 'Assam Strong Tea', price: 140, category: 'Beverages', unit: '250g', brand: 'GreenBasket', image: '', description: 'Rich black tea leaves.' },
  { externalId: 's-bev-3', name: 'Instant Coffee Powder', price: 320, category: 'Beverages', unit: '100g', brand: 'GreenBasket', image: '', description: 'Rich roasted coffee.' },
  { externalId: 's-bev-4', name: 'Sparkling Water', price: 60, category: 'Beverages', unit: '500ml', brand: 'GreenBasket', image: '', description: 'Bubbly mineral water.' },
  { externalId: 's-bev-5', name: 'Cola Soft Drink', price: 40, category: 'Beverages', unit: '600ml', brand: 'GreenBasket', image: '', description: 'Classic fizzy drink.' },
  { externalId: 's-bev-6', name: 'Coconut Water', price: 50, category: 'Beverages', unit: '200ml', brand: 'GreenBasket', image: '', description: 'Pure tender coconut.' },
  { externalId: 's-bev-7', name: 'Green Tea Bags', price: 210, category: 'Beverages', unit: '25pcs', brand: 'GreenBasket', image: '', description: 'Healthy green tea.' },
  { externalId: 's-bev-8', name: 'Apple Juice Tetra', price: 95, category: 'Beverages', unit: '1L', brand: 'GreenBasket', image: '', description: 'Sweet clear apple juice.' },
  { externalId: 's-bev-9', name: 'Energy Drink', price: 110, category: 'Beverages', unit: '250ml', brand: 'GreenBasket', image: '', description: 'Energy boosting drink.' },
  { externalId: 's-bev-10', name: 'Tomato Juice', price: 120, category: 'Beverages', unit: '1L', brand: 'GreenBasket', image: '', description: 'Spicy savory juice.' },
  { externalId: 's-bev-11', name: 'Lemonade Can', price: 35, category: 'Beverages', unit: '300ml', brand: 'GreenBasket', image: '', description: 'Refreshing lemon drink.' },
  { externalId: 's-bev-12', name: 'Iced Coffee Latte', price: 65, category: 'Beverages', unit: '200ml', brand: 'GreenBasket', image: '', description: 'Cold creamy coffee.' },
  { externalId: 's-bev-13', name: 'Aloe Vera Juice', price: 250, category: 'Beverages', unit: '1L', brand: 'GreenBasket', image: '', description: 'Healthy detox drink.' },
  { externalId: 's-bev-14', name: 'Chamomile Tea', price: 340, category: 'Beverages', unit: '20pcs', brand: 'GreenBasket', image: '', description: 'Calming herbal tea.' },
  { externalId: 's-bev-15', name: 'Drinking Water', price: 20, category: 'Beverages', unit: '1L', brand: 'GreenBasket', image: '', description: 'Pure mineral water.' },

  // FROZEN FOODS (15)
  { externalId: 's-fro-1', name: 'Frozen Garden Peas', price: 90, category: 'Frozen Foods', unit: '500g', brand: 'GreenBasket', image: '', description: 'Sweet frozen peas.' },
  { externalId: 's-fro-2', name: 'Veggie Margherita Pizza', price: 220, category: 'Frozen Foods', unit: '350g', brand: 'GreenBasket', image: '', description: 'Classic cheesy pizza.' },
  { externalId: 's-fro-3', name: 'French Fries Classic', price: 140, category: 'Frozen Foods', unit: '750g', brand: 'GreenBasket', image: '', description: 'Golden crispy fries.' },
  { externalId: 's-fro-4', name: 'Frozen Sweet Corn', price: 85, category: 'Frozen Foods', unit: '500g', brand: 'GreenBasket', image: '', description: 'Juicy golden corn.' },
  { externalId: 's-fro-5', name: 'Chicken Nuggets', price: 320, category: 'Frozen Foods', unit: '500g', brand: 'GreenBasket', image: '', description: 'Breaded chicken snacks.' },
  { externalId: 's-fro-6', name: 'Vegetable Spring Rolls', price: 180, category: 'Frozen Foods', unit: '10pcs', brand: 'GreenBasket', image: '', description: 'Crispy veggie rolls.' },
  { externalId: 's-fro-7', name: 'Frozen Blueberries', price: 450, category: 'Frozen Foods', unit: '250g', brand: 'GreenBasket', image: '', description: 'Frozen antioxidant berries.' },
  { externalId: 's-fro-8', name: 'Paneer Tikka Frozen', price: 280, category: 'Frozen Foods', unit: '300g', brand: 'GreenBasket', image: '', description: 'Marinated paneer snacks.' },
  { externalId: 's-fro-9', name: 'Frozen Mixed Veg', price: 110, category: 'Frozen Foods', unit: '500g', brand: 'GreenBasket', image: '', description: 'Carrot, corn and peas.' },
  { externalId: 's-fro-10', name: 'Chicken Tikka Pizza', price: 290, category: 'Frozen Foods', unit: '400g', brand: 'GreenBasket', image: '', description: 'Spicy chicken pizza.' },
  { externalId: 's-fro-11', name: 'Frozen Prawns', price: 580, category: 'Frozen Foods', unit: '500g', brand: 'GreenBasket', image: '', description: 'Cleaned frozen prawns.' },
  { externalId: 's-fro-12', name: 'Potato Wedges', price: 160, category: 'Frozen Foods', unit: '750g', brand: 'GreenBasket', image: '', description: 'Spiced thick wedges.' },
  { externalId: 's-fro-13', name: 'Ice Cream Vanilla', price: 210, category: 'Frozen Foods', unit: '700ml', brand: 'GreenBasket', image: '', description: 'Classic creamy vanilla.' },
  { externalId: 's-fro-14', name: 'Falafel Mix Frozen', price: 195, category: 'Frozen Foods', unit: '300g', brand: 'GreenBasket', image: '', description: 'Middle eastern snacks.' },
  { externalId: 's-fro-15', name: 'Frozen Strawberries', price: 340, category: 'Frozen Foods', unit: '250g', brand: 'GreenBasket', image: '', description: 'Flash frozen berries.' },

  // PERSONAL CARE (15)
  { externalId: 's-per-1', name: 'Herbal Aloe Shampoo', price: 180, category: 'Personal Care', unit: '200ml', brand: 'GreenBasket', image: '', description: 'Soft hair shampoo.' },
  { externalId: 's-per-2', name: 'Charcoal Face Wash', price: 150, category: 'Personal Care', unit: '100ml', brand: 'GreenBasket', image: '', description: 'Deep clean wash.' },
  { externalId: 's-per-3', name: 'Moisturizing Lotion', price: 240, category: 'Personal Care', unit: '200ml', brand: 'GreenBasket', image: '', description: 'Soft skin body lotion.' },
  { externalId: 's-per-4', name: 'Antiseptic Liquid', price: 110, category: 'Personal Care', unit: '500ml', brand: 'GreenBasket', image: '', description: 'Trusted protection liquid.' },
  { externalId: 's-per-5', name: 'Toothpaste Mint', price: 95, category: 'Personal Care', unit: '150g', brand: 'GreenBasket', image: '', description: 'Fresh breath paste.' },
  { externalId: 's-per-6', name: 'Bath Soap Rose', price: 40, category: 'Personal Care', unit: '125g', brand: 'GreenBasket', image: '', description: 'Fragrant bath soap.' },
  { externalId: 's-per-7', name: 'Deodorant Spray', price: 190, category: 'Personal Care', unit: '150ml', brand: 'GreenBasket', image: '', description: 'Long lasting fragrance.' },
  { externalId: 's-per-8', name: 'Sunscreen SPF 50', price: 450, category: 'Personal Care', unit: '50ml', brand: 'GreenBasket', image: '', description: 'UVA/UVB protection.' },
  { externalId: 's-per-9', name: 'Hand Wash Refill', price: 120, category: 'Personal Care', unit: '750ml', brand: 'GreenBasket', image: '', description: 'Anti-germ hand wash.' },
  { externalId: 's-per-10', name: 'Shaving Foam', price: 210, category: 'Personal Care', unit: '200g', brand: 'GreenBasket', image: '', description: 'Smooth shave foam.' },
  { externalId: 's-per-11', name: 'Mouthwash Cool Mint', price: 160, category: 'Personal Care', unit: '250ml', brand: 'GreenBasket', image: '', description: 'Total mouth protection.' },
  { externalId: 's-per-12', name: 'Hair Oil Coconut', price: 90, category: 'Personal Care', unit: '200ml', brand: 'GreenBasket', image: '', description: 'Pure coconut hair oil.' },
  { externalId: 's-per-13', name: 'Body Wash Gel', price: 180, category: 'Personal Care', unit: '250ml', brand: 'GreenBasket', image: '', description: 'Nourishing shower gel.' },
  { externalId: 's-per-14', name: 'Face Mask Sheet', price: 99, category: 'Personal Care', unit: '1pc', brand: 'GreenBasket', image: '', description: 'Instant glow mask.' },
  { externalId: 's-per-15', name: 'Hand Sanitizer', price: 50, category: 'Personal Care', unit: '50ml', brand: 'GreenBasket', image: '', description: 'Instant germ protection.' },

  // HOUSEHOLD (15)
  { externalId: 's-hou-1', name: 'Liquid Laundry Detergent', price: 340, category: 'Household', unit: '1L', brand: 'GreenBasket', image: '', description: 'Clean fresh clothes.' },
  { externalId: 's-hou-2', name: 'Multi-Surface Cleaner', price: 95, category: 'Household', unit: '500ml', brand: 'GreenBasket', image: '', description: 'Surface disinfectant.' },
  { externalId: 's-hou-3', name: 'Dishwash Liquid', price: 110, category: 'Household', unit: '500ml', brand: 'GreenBasket', image: '', description: 'Lemon fresh dish wash.' },
  { externalId: 's-hou-4', name: 'Kitchen Paper Towels', price: 80, category: 'Household', unit: '2ply', brand: 'GreenBasket', image: '', description: 'Absorbent kitchen rolls.' },
  { externalId: 's-hou-5', name: 'Toilet Cleaner Blue', price: 85, category: 'Household', unit: '500ml', brand: 'GreenBasket', image: '', description: 'Strong toilet disinfectant.' },
  { externalId: 's-hou-6', name: 'Floor Mop Set', price: 450, category: 'Household', unit: '1set', brand: 'GreenBasket', image: '', description: 'Microfiber easy mop.' },
  { externalId: 's-hou-7', name: 'Garbage Bags Large', price: 120, category: 'Household', unit: '30pcs', brand: 'GreenBasket', image: '', description: 'Heavy duty trash bags.' },
  { externalId: 's-hou-8', name: 'Aluminum Foil Roll', price: 140, category: 'Household', unit: '18m', brand: 'GreenBasket', image: '', description: 'Food grade packing foil.' },
  { externalId: 's-hou-9', name: 'Air Freshener Spray', price: 160, category: 'Household', unit: '300ml', brand: 'GreenBasket', image: '', description: 'Floral scent air spray.' },
  { externalId: 's-hou-10', name: 'Sponge Scrubber', price: 40, category: 'Household', unit: '3pcs', brand: 'GreenBasket', image: '', description: 'Durable dish scrubbers.' },
  { externalId: 's-hou-11', name: 'Fabric Conditioner', price: 210, category: 'Household', unit: '800ml', brand: 'GreenBasket', image: '', description: 'Soft fragrant laundry.' },
  { externalId: 's-hou-12', name: 'Glass Cleaner', price: 75, category: 'Household', unit: '500ml', brand: 'GreenBasket', image: '', description: 'Shine for all glass.' },
  { externalId: 's-hou-13', name: 'Shoe Polish Black', price: 55, category: 'Household', unit: '40g', brand: 'GreenBasket', image: '', description: 'Shine for leather shoes.' },
  { externalId: 's-hou-14', name: 'Mosquito Repellent', price: 90, category: 'Household', unit: '45ml', brand: 'GreenBasket', image: '', description: 'Vaporizer for mosquitoes.' },
  { externalId: 's-hou-15', name: 'Matches Box', price: 15, category: 'Household', unit: '10pk', brand: 'GreenBasket', image: '', description: 'Safe matchsticks.' },

  // PET CARE (15)
  { externalId: 's-pet-1', name: 'Adult Dog Food - Chicken', price: 650, category: 'Pet Care', unit: '3kg', brand: 'GreenBasket', image: '', description: 'Balanced nutrition dog food.' },
  { externalId: 's-pet-2', name: 'Crunchy Cat Treats', price: 140, category: 'Pet Care', unit: '100g', brand: 'GreenBasket', image: '', description: 'Soft center cat treats.' },
  { externalId: 's-pet-3', name: 'Puppy Dry Food', price: 420, category: 'Pet Care', unit: '1.2kg', brand: 'GreenBasket', image: '', description: 'Growth food for puppies.' },
  { externalId: 's-pet-4', name: 'Cat Litter Fragrant', price: 380, category: 'Pet Care', unit: '5kg', brand: 'GreenBasket', image: '', description: 'Odor control cat litter.' },
  { externalId: 's-pet-5', name: 'Dog Chew Bones', price: 150, category: 'Pet Care', unit: '2pcs', brand: 'GreenBasket', image: '', description: 'Long lasting dental chews.' },
  { externalId: 's-pet-6', name: 'Bird Seed Mix', price: 210, category: 'Pet Care', unit: '1kg', brand: 'GreenBasket', image: '', description: 'Nutritious mix for birds.' },
  { externalId: 's-pet-7', name: 'Pet Shampoo Gentle', price: 280, category: 'Pet Care', unit: '250ml', brand: 'GreenBasket', image: '', description: 'Conditioning pet shampoo.' },
  { externalId: 's-pet-8', name: 'Kitten Wet Food', price: 45, category: 'Pet Care', unit: '85g', brand: 'GreenBasket', image: '', description: 'Fine meat for kittens.' },
  { externalId: 's-pet-9', name: 'Dog Leash Durable', price: 350, category: 'Pet Care', unit: '1pc', brand: 'GreenBasket', image: '', description: 'Nylon leash for dogs.' },
  { externalId: 's-pet-10', name: 'Fish Flake Food', price: 120, category: 'Pet Care', unit: '50g', brand: 'GreenBasket', image: '', description: 'Complete food for fish.' },
  { externalId: 's-pet-11', name: 'Pet De-shedding Tool', price: 450, category: 'Pet Care', unit: '1pc', brand: 'GreenBasket', image: '', description: 'Professional grooming brush.' },
  { externalId: 's-pet-12', name: 'Guinea Pig Pellets', price: 290, category: 'Pet Care', unit: '800g', brand: 'GreenBasket', image: '', description: 'Daily food for small pets.' },
  { externalId: 's-pet-13', name: 'Pet Odor Remover', price: 240, category: 'Pet Care', unit: '500ml', brand: 'GreenBasket', image: '', description: 'Enzymatic stain remover.' },
  { externalId: 's-pet-14', name: 'Dog Squeaky Toy', price: 180, category: 'Pet Care', unit: '1pc', brand: 'GreenBasket', image: '', description: 'Durable play toy.' },
  { externalId: 's-pet-15', name: 'Catnip Spray', price: 160, category: 'Pet Care', unit: '30ml', brand: 'GreenBasket', image: '', description: 'Stimulating spray for cats.' },
];

const curatedExternalIds = seedData.map((product) => product.externalId);

const prepareSeedProduct = (product) => ({
  ...product,
  image: `greenbasket-art://${product.category.toLowerCase().replaceAll(' ', '-')}`,
  brand: 'GreenBasket',
  origin: 'India',
  source: 'greenbasket-original',
  stock: product.stock || 100,
  rating: product.rating || 4.5,
  tags: product.tags || [product.category.toLowerCase(), product.name.toLowerCase()],
});

const ensureCuratedCatalog = async () => {
  const existingCount = await Product.countDocuments({ externalId: { $in: curatedExternalIds } });
  const legacyCount = await Product.countDocuments({
    externalId: { $in: curatedExternalIds },
    source: { $ne: 'greenbasket-original' },
  });
  if (existingCount < seedData.length || legacyCount > 0) {
    await Promise.all(seedData.map((product) => Product.findOneAndUpdate(
      { externalId: product.externalId },
      prepareSeedProduct(product),
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )));
  }

  return Product.find({ externalId: { $in: curatedExternalIds } }).sort({ category: 1, createdAt: -1 });
};

const ensureCategoryCatalog = async (category) => {
  const categorySeed = seedData.filter((product) => product.category === category);
  const categoryExternalIds = categorySeed.map((product) => product.externalId);

  const existingCount = await Product.countDocuments({ externalId: { $in: categoryExternalIds } });
  const legacyCount = await Product.countDocuments({
    externalId: { $in: categoryExternalIds },
    source: { $ne: 'greenbasket-original' },
  });
  if (existingCount < categorySeed.length || legacyCount > 0) {
    await Promise.all(categorySeed.map((product) => Product.findOneAndUpdate(
      { externalId: product.externalId },
      prepareSeedProduct(product),
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )));
  }

  return Product.find({
    externalId: { $in: categoryExternalIds },
    category,
  }).sort({ createdAt: -1 });
};

router.post('/seed', async (req, res) => {
  try {
    if (!process.env.CATALOG_ADMIN_KEY || req.get('x-admin-key') !== process.env.CATALOG_ADMIN_KEY) {
      return res.status(403).json({ message: 'Catalog admin key required' });
    }
    await Promise.all(seedData.map((product) => Product.findOneAndUpdate(
      { externalId: product.externalId },
      prepareSeedProduct(product),
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )));
    productCache = { expiresAt: 0, products: [] };
    return res.json({ message: 'Database seeded successfully', count: seedData.length });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/refresh', asyncHandler(async (req, res) => {
  if (!process.env.CATALOG_ADMIN_KEY || req.get('x-admin-key') !== process.env.CATALOG_ADMIN_KEY) {
    return res.status(403).json({ message: 'Catalog admin key required' });
  }
  productCache = {
    expiresAt: 0,
    products: [],
  };
  const products = await ensureCuratedCatalog();
  res.json({ message: 'GreenBasket catalog refreshed', count: products.length });
}));

module.exports = router;

