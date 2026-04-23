export const INR_EXCHANGE_RATE = 83;
export const BASE_DELIVERY_FEE = 25;
export const TAX_RATE = 0.05;

export const toINR = (baseAmount: number): number => {
  return Math.round(baseAmount * INR_EXCHANGE_RATE);
};

export const getDeliveryFeeINR = (): number => {
  return toINR(BASE_DELIVERY_FEE);
};

export const calculateDeliveryTotalsINR = (baseSubtotal: number) => {
  const subtotal = toINR(baseSubtotal);
  const deliveryFee = getDeliveryFeeINR();
  const taxAmount = Math.round((subtotal + deliveryFee) * TAX_RATE);
  const grandTotal = subtotal + deliveryFee + taxAmount;

  return {
    subtotal,
    deliveryFee,
    taxAmount,
    grandTotal,
  };
};
