/**
 * Generates an instant WhatsApp formatted invoice text
 * and returns the direct WhatsApp URL for 1-click customer delivery receipts.
 */
export const generateWhatsAppInvoice = (order, helperName = 'Shop Helper') => {
  if (!order) return '';

  const cleanPhone = (order.deliveryAddress?.phone || '').replace(/\D/g, '').slice(-10);
  const itemsText = (order.items || [])
    .map((item, idx) => `  ${idx + 1}. *${item.name}* × ${item.quantity} = ₹${item.price * item.quantity}`)
    .join('\n');

  const invoiceMessage = `*============================*
*🌱 GROCERY STORE — OFFICIAL INVOICE*
*Hyperlocal 300m–500m Express Delivery*
*============================*

*Order Reference:* #${order.orderNumber}
*Customer:* ${order.deliveryAddress?.name || 'Valued Customer'}
*Delivery Address:* ${order.deliveryAddress?.address || 'Local Area'}
*Slot:* ${order.deliverySlot || 'Express 10-15 Mins'}

*ITEMS MANIFEST:*
${itemsText}

*----------------------------*
*TOTAL AMOUNT:* *₹${order.totalAmount}*
*Payment Mode:* ${order.paymentMethod?.toUpperCase()} (${order.paymentStatus === 'paid' ? 'PAID ✓' : 'COLLECT CASH'})
*Delivery Helper:* ${helperName}
${order.deliveryOtp ? `*Handover OTP Verified:* ${order.deliveryOtp}\n` : ''}*----------------------------*

_Thank you for choosing GroceryStore! For any assistance, reach us at care@grocerystore.in_`;

  return `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(invoiceMessage)}`;
};

/**
 * Web Audio API synthesizer for incoming order alert chime.
 * Generates an authentic, crisp double-beep tone without external audio files.
 */
export const playOrderAlertChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playTone = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

      gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    };

    // Double chime: 880Hz (A5) then 1174Hz (D6)
    playTone(880, 0, 0.25);
    playTone(1174, 0.28, 0.35);
  } catch (err) {
    console.log('Audio alert chime disabled by browser autoplay policy:', err);
  }
};
