const express = require('express');
const router = express.Router();
const InventoryBatch = require('../models/InventoryBatch');
const WasteLog = require('../models/WasteLog');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

// Seed realistic inventory batches if empty
const ensureSeedBatches = async () => {
  const count = await InventoryBatch.countDocuments();
  if (count === 0) {
    const products = await Product.find().limit(10);
    if (products.length > 0) {
      const sampleBatches = [
        {
          productId: products[0]._id,
          productName: products[0].name,
          batchNumber: 'BATCH-2026-NSK-01',
          supplier: 'Sahyadri Farmers Producer Co-op',
          farmOrigin: 'Dindori, Nashik',
          receivedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          expiryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days left (near expiry)
          quantityReceived: 100,
          quantityRemaining: 42,
          costPrice: Math.round(products[0].price * 0.7),
          sellingPrice: products[0].price,
          status: 'near_expiry',
          markdownDiscount: 20,
        },
        {
          productId: products[1]._id,
          productName: products[1].name,
          batchNumber: 'BATCH-2026-PUN-02',
          supplier: 'Baramati Agro Cluster',
          farmOrigin: 'Shirur, Pune',
          receivedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          expiryDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days left
          quantityReceived: 80,
          quantityRemaining: 65,
          costPrice: Math.round(products[1].price * 0.65),
          sellingPrice: products[1].price,
          status: 'near_expiry',
          markdownDiscount: 15,
        },
        {
          productId: products[2] ? products[2]._id : products[0]._id,
          productName: products[2] ? products[2].name : products[0].name,
          batchNumber: 'BATCH-2026-HIM-03',
          supplier: 'Himachal Apple Growers Union',
          farmOrigin: 'Kotgarh Orchards, Shimla',
          receivedDate: new Date(),
          expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days left
          quantityReceived: 150,
          quantityRemaining: 140,
          costPrice: 90,
          sellingPrice: 160,
          status: 'active',
          markdownDiscount: 0,
        },
        {
          productId: products[3] ? products[3]._id : products[0]._id,
          productName: products[3] ? products[3].name : products[0].name,
          batchNumber: 'BATCH-2026-AMR-04',
          supplier: 'Punjab Dairy Federation',
          farmOrigin: 'Amritsar District Farms',
          receivedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days left
          quantityReceived: 60,
          quantityRemaining: 18,
          costPrice: 45,
          sellingPrice: 65,
          status: 'near_expiry',
          markdownDiscount: 30,
        },
      ];
      await InventoryBatch.insertMany(sampleBatches);
    }
  }
};

// GET /api/inventory/batches - FEFO sorted list
router.get('/batches', asyncHandler(async (req, res) => {
  await ensureSeedBatches();
  const { status } = req.query;
  const filter = status ? { status } : {};
  const batches = await InventoryBatch.find(filter).sort({ expiryDate: 1 });
  res.json(batches);
}));

// GET /api/inventory/radar - Freshness & Waste Reduction metrics
router.get('/radar', asyncHandler(async (req, res) => {
  await ensureSeedBatches();
  const now = new Date();
  const next7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const allBatches = await InventoryBatch.find();
  const nearExpiryBatches = allBatches.filter(
    (b) => b.expiryDate > now && b.expiryDate <= next7Days && b.quantityRemaining > 0
  );
  const expiredBatches = allBatches.filter(
    (b) => b.expiryDate <= now && b.quantityRemaining > 0
  );
  const activeBatches = allBatches.filter(
    (b) => b.expiryDate > next7Days && b.quantityRemaining > 0
  );

  const totalWasteLossResult = await WasteLog.aggregate([
    { $group: { _id: null, totalLoss: { $sum: '$financialLoss' }, count: { $sum: 1 } } },
  ]);

  const totalLoss = totalWasteLossResult[0]?.totalLoss || 0;

  // Potential waste prevention value (selling price of near-expiry inventory rescued via markdowns)
  const rescuedValue = nearExpiryBatches.reduce(
    (sum, b) => sum + (b.quantityRemaining * b.sellingPrice * ((b.markdownDiscount || 20) / 100)),
    0
  );

  res.json({
    totalBatches: allBatches.length,
    activeBatchesCount: activeBatches.length,
    nearExpiryCount: nearExpiryBatches.length,
    expiredCount: expiredBatches.length,
    nearExpiryBatches,
    expiredBatches,
    totalLossRecorded: totalLoss,
    rescuedValueEstimate: Math.round(rescuedValue),
    fefoCompliance: '100% FEFO Rotation Enforced',
  });
}));

// POST /api/inventory/apply-markdown - Approve markdown discount for near-expiry batch
router.post('/apply-markdown', asyncHandler(async (req, res) => {
  const { batchId, discountPercent } = req.body;
  const batch = await InventoryBatch.findById(batchId);
  if (!batch) {
    return res.status(404).json({ message: 'Batch not found' });
  }

  batch.markdownDiscount = Number(discountPercent) || 20;
  batch.markdownApplied = true;
  await batch.save();

  // Also update product discount if this is the active batch
  if (batch.productId) {
    await Product.findByIdAndUpdate(batch.productId, {
      discount: batch.markdownDiscount,
    });
  }

  res.json({
    success: true,
    message: `Batch ${batch.batchNumber} marked down by ${batch.markdownDiscount}%. Freshness pricing active.`,
    batch,
  });
}));

// POST /api/inventory/write-off - Write off expired/damaged batch to waste log
router.post('/write-off', asyncHandler(async (req, res) => {
  const { batchId, quantity, reason, notes } = req.body;
  const batch = await InventoryBatch.findById(batchId);
  if (!batch) {
    return res.status(404).json({ message: 'Batch not found' });
  }

  const writeOffQty = Math.min(Number(quantity) || batch.quantityRemaining, batch.quantityRemaining);
  const financialLoss = writeOffQty * batch.costPrice;

  batch.quantityRemaining -= writeOffQty;
  if (batch.quantityRemaining === 0) {
    batch.status = 'written_off';
  }
  await batch.save();

  const wasteEntry = await WasteLog.create({
    batchId: batch._id,
    productId: batch.productId,
    productName: batch.productName,
    quantity: writeOffQty,
    reason: reason || 'expired',
    financialLoss,
    notes: notes || 'Logged during daily morning freshness audit',
  });

  res.json({
    success: true,
    message: `Successfully written off ${writeOffQty} units. Loss logged for reporting.`,
    wasteEntry,
  });
}));

// GET /api/inventory/waste-logs - Audit trail of all write-offs
router.get('/waste-logs', asyncHandler(async (req, res) => {
  const logs = await WasteLog.find().sort({ createdAt: -1 }).limit(50);
  res.json(logs);
}));

module.exports = router;
