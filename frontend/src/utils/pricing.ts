export const INR_EXCHANGE_RATE = 83;
export const BASE_DELIVERY_FEE = 25;
export const TAX_RATE = 0.05;

export const toINR = (baseAmount: number): number => {
  return baseAmount * INR_EXCHANGE_RATE;
};

export const getDeliveryFeeINR = (): number => {
  return Math.round(toINR(BASE_DELIVERY_FEE));
};

export const calculateOrderBreakdownINR = (baseSubtotal: number) => {
  const subtotal = Math.round(toINR(baseSubtotal));
  const deliveryFee = getDeliveryFeeINR();
  const taxableAmount = subtotal + deliveryFee;
  const tax = Math.round(taxableAmount * TAX_RATE);
  const total = subtotal + deliveryFee + tax;

  return {
    subtotal,
    deliveryFee,
    tax,
    total,
  };
};
