let razorpayScriptLoaded = false;

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (razorpayScriptLoaded || window.Razorpay) {
      razorpayScriptLoaded = true;
      resolve(true);
      return;
    }
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(Boolean(window.Razorpay)), { once: true });
      existingScript.addEventListener('error', () => resolve(false), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      razorpayScriptLoaded = true;
      resolve(true);
    };
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const initiatePayment = (keyId, order, customer = {}) => {
  return loadRazorpayScript().then((loaded) => {
    if (!loaded || !window.Razorpay) {
      throw new Error('Razorpay SDK failed to load');
    }

    return new Promise((resolve, reject) => {
      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'GreenBasket',
        description: 'Online Grocery Store order',
        order_id: order.id,
        handler: resolve,
        prefill: {
          name: customer.name || '',
          email: customer.email || '',
        },
        theme: {
          color: '#145c35',
        },
        modal: {
          ondismiss: () => reject(new Error('Payment cancelled')),
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        reject(new Error(response.error?.description || 'Payment failed'));
      });
      rzp.open();
    });
  });
};

export { initiatePayment };
