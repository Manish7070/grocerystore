const read = (storage, key) => {
  try { return JSON.parse(storage.getItem(key)); } catch { return null; }
};

export const cartFingerprint = (cart) => JSON.stringify(cart.map(item => [item._id, Number(item.quantity)]).sort((a, b) => a[0].localeCompare(b[0])));

export function readAddressDraft(storage, user) {
  const draft = user?._id ? read(storage, `checkout-address:${user._id}`) : null;
  const defaults = { name: user?.name || '', phone: '', address: '', city: '', pincode: '', ...user?.deliveryProfile };
  return Object.fromEntries(['name', 'phone', 'address', 'city', 'pincode'].map(key => [
    key, typeof draft?.[key] === 'string' ? draft[key] : String(defaults[key] || ''),
  ]));
}

export function readPendingPayment(storage, userId) {
  if (!userId) return null;
  const pending = read(storage, `checkout-payment:${userId}`);
  const response = pending?.response;
  return typeof pending?.id === 'string' && pending.id.startsWith('order_')
    && response?.razorpay_order_id === pending.id
    && typeof response.razorpay_payment_id === 'string'
    && typeof response.razorpay_signature === 'string' ? pending : null;
}

export function savePendingPayment(storage, userId, pending) {
  if (!userId) return;
  try {
    const key = `checkout-payment:${userId}`;
    if (pending) storage.setItem(key, JSON.stringify(pending));
    else storage.removeItem(key);
  } catch { /* Order history also provides server-side payment recovery. */ }
}
