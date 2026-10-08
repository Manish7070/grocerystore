const badRequest = (message) => Object.assign(new Error(message), { statusCode: 400 });

function validateDelivery(value) {
  const fields = { name: 100, phone: 16, address: 500, city: 100, pincode: 6 };
  const delivery = {};
  for (const [field, limit] of Object.entries(fields)) {
    if (typeof value?.[field] !== 'string' || !value[field].trim() || value[field].trim().length > limit) {
      throw badRequest(`Enter a valid delivery ${field}`);
    }
    delivery[field] = value[field].trim();
  }
  if (!/^(?:\+91[ -]?)?[6-9]\d{9}$/.test(delivery.phone)) {
    throw badRequest('Enter a valid 10-digit Indian mobile number');
  }
  if (!/^[1-9]\d{5}$/.test(delivery.pincode)) {
    throw badRequest('Enter a valid 6-digit delivery pincode');
  }
  return delivery;
}

function validateItems(items) {
  if (!Array.isArray(items) || !items.length || items.length > 240) {
    throw badRequest('Your cart must contain between 1 and 240 items');
  }
  const quantities = new Map();
  for (const item of items) {
    if (!item || typeof item.productId !== 'string' || !/^[a-f\d]{24}$/i.test(item.productId)
      || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
      throw badRequest('Cart contains an invalid item or quantity');
    }
    const id = item.productId.toLowerCase();
    const quantity = (quantities.get(id) || 0) + item.quantity;
    if (quantity > 99) throw badRequest('Maximum quantity per product is 99');
    quantities.set(id, quantity);
  }
  return quantities;
}

module.exports = { badRequest, validateDelivery, validateItems };
