let scriptPromise;

const loadRazorpayScript = () => {
  if (window.Razorpay) return Promise.resolve(true);
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    const finish = (loaded) => {
      window.clearTimeout(timeout);
      script.onload = null;
      script.onerror = null;
      if (!loaded) {
        script.remove();
        scriptPromise = null;
      }
      resolve(loaded);
    };
    const timeout = window.setTimeout(() => finish(false), 15000);
    script.onload = () => finish(Boolean(window.Razorpay));
    script.onerror = () => finish(false);
    document.body.appendChild(script);
  });
  return scriptPromise;
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
        name: 'GroceryStore',
        description: 'GroceryStore Market Order',
        order_id: order.id,
        handler: resolve,
        prefill: {
          name: customer.name || '',
          email: customer.email || '',
          contact: customer.phone || '',
        },
        theme: {
          color: '#B65337',
        },
        modal: {
          ondismiss: () => reject(new Error('Payment cancelled')),
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        rzp.close();
        reject(new Error(response.error?.description || 'Payment failed'));
      });
      rzp.open();
    });
  });
};

export { initiatePayment };
