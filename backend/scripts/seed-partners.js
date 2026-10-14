const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const User = require('../models/User');
const Product = require('../models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/greenbasket';

const seedPartners = async () => {
  try {
    console.log('Connecting to MongoDB:', MONGO_URI);
    await mongoose.connect(MONGO_URI);

    const salt = await bcrypt.genSalt(10);

    // 1. Super Admin
    const adminPassword = await bcrypt.hash('Admin@123', salt);
    await User.findOneAndUpdate(
      { email: 'admin@grocerystore.in' },
      {
        name: 'Super Administrator',
        email: 'admin@grocerystore.in',
        password: adminPassword,
        role: 'admin',
        isAdmin: true,
        isBlocked: false,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log('✓ Admin account ready: admin@grocerystore.in (Password: Admin@123)');

    // 2. Kisan Producer
    const kisanPassword = await bcrypt.hash('Kisan@123', salt);
    const kisan = await User.findOneAndUpdate(
      { email: 'ramesh.kisan@grocerystore.in' },
      {
        name: 'Ramesh Patel (Kisan)',
        email: 'ramesh.kisan@grocerystore.in',
        password: kisanPassword,
        role: 'kisan',
        phone: '9876543210',
        isBlocked: false,
        partnerProfile: {
          businessName: 'Ramesh Organic Orchards',
          villageOrArea: 'Rampur Panchayat Hub (Ward 3)',
          isVerified: true,
          walletBalance: 0,
          todayPriceUpdated: true,
          rating: 4.9,
          ratingCount: 24,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log('✓ Kisan account ready: ramesh.kisan@grocerystore.in (Password: Kisan@123)');

    // 3. Shopkeeper / Dukan Partner (Ward 3)
    const shopPassword = await bcrypt.hash('Dukan@123', salt);
    const shopkeeper = await User.findOneAndUpdate(
      { email: 'gupta.kirana@grocerystore.in' },
      {
        name: 'Suresh Gupta (Dukandar)',
        email: 'gupta.kirana@grocerystore.in',
        password: shopPassword,
        role: 'shopkeeper',
        phone: '9811122233',
        isBlocked: false,
        partnerProfile: {
          businessName: 'Gupta Kirana Store',
          villageOrArea: 'Ward 3 Main Bazaar (300m)',
          isVerified: true,
          walletBalance: 250,
          todayPriceUpdated: true,
          dailySalesTotal: 180,
          rating: 4.8,
          ratingCount: 65,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log('✓ Shopkeeper account ready: gupta.kirana@grocerystore.in (Password: Dukan@123)');

    // 3b. Shopkeeper / Dukan Partner (Station Road)
    const stationShopPassword = await bcrypt.hash('Station@123', salt);
    await User.findOneAndUpdate(
      { email: 'verma.station@grocerystore.in' },
      {
        name: 'Rajesh Verma (Dukandar)',
        email: 'verma.station@grocerystore.in',
        password: stationShopPassword,
        role: 'shopkeeper',
        phone: '9844455566',
        isBlocked: false,
        partnerProfile: {
          businessName: 'Verma Daily Needs & Dairy',
          villageOrArea: 'Station Road Area (400m)',
          isVerified: true,
          walletBalance: 420,
          todayPriceUpdated: true,
          dailySalesTotal: 310,
          rating: 4.9,
          ratingCount: 88,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log('✓ Station Road Shopkeeper account ready: verma.station@grocerystore.in (Password: Station@123)');

    // 4. Branch Distributor
    const branchPassword = await bcrypt.hash('Branch@123', salt);
    const distributor = await User.findOneAndUpdate(
      { email: 'delhi.distributor@grocerystore.in' },
      {
        name: 'Anil Sharma (Distributor)',
        email: 'delhi.distributor@grocerystore.in',
        password: branchPassword,
        role: 'distributor',
        phone: '9822233344',
        isBlocked: false,
        partnerProfile: {
          businessName: 'GroceryStore Central Branch Hub',
          villageOrArea: 'District Sector 5 Hub',
          isVerified: true,
          rating: 5.0,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log('✓ Distributor account ready: delhi.distributor@grocerystore.in (Password: Branch@123)');

    // 5. Delivery Helper
    const helperPassword = await bcrypt.hash('Helper@123', salt);
    await User.findOneAndUpdate(
      { email: 'sonu.helper@grocerystore.in' },
      {
        name: 'Sonu Kumar (Helper)',
        email: 'sonu.helper@grocerystore.in',
        password: helperPassword,
        role: 'helper',
        phone: '9833344455',
        isBlocked: false,
        partnerProfile: {
          businessName: 'Gupta Kirana Express Fleet',
          villageOrArea: 'Ward 3 Delivery Area',
          isVerified: true,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log('✓ Helper account ready: sonu.helper@grocerystore.in (Password: Helper@123)');

    // 6. Sample Pending Harvests from Kisan for Admin Approvals
    await Product.findOneAndUpdate(
      { name: 'Fresh Farm Pahadi Aloo (आलू)' },
      {
        name: 'Fresh Farm Pahadi Aloo (आलू)',
        category: 'Vegetables',
        price: 20, // Kisan base price placeholder
        kisanBasePrice: 20,
        mrp: 30,
        stock: 120,
        unit: '1 kg',
        description: 'Fresh organic potatoes harvested from Rampur Panchayat farm',
        approvalStatus: 'pending', // Pending Admin review!
        farmSource: 'Ramesh Organic Orchards',
        origin: 'Rampur Farm',
        addedBy: {
          userId: kisan._id,
          role: 'kisan',
          name: 'Ramesh Patel (Kisan)',
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await Product.findOneAndUpdate(
      { name: 'Pure Desi Red Onions (नाशिक प्याज)' },
      {
        name: 'Pure Desi Red Onions (नाशिक प्याज)',
        category: 'Vegetables',
        price: 25,
        kisanBasePrice: 25,
        mrp: 35,
        stock: 80,
        unit: '1 kg',
        description: 'Naturally cured red onions with thin skin and rich sweetness',
        approvalStatus: 'pending',
        farmSource: 'Ramesh Organic Orchards',
        origin: 'Rampur Farm',
        addedBy: {
          userId: kisan._id,
          role: 'kisan',
          name: 'Ramesh Patel (Kisan)',
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log('✓ Sample pending kisan harvests inserted for Admin Approval queue!');
    console.log('All demo partner credentials and workflows successfully seeded.');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

seedPartners();
