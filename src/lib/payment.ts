export interface PaymentRequest {
  amount: number;
  currency: string;
  reference: string;
  description: string;
  returnUrl: string;
  cancelUrl: string;
}

export function calculateFees(baseAmount: number) {
  const internationalFee = baseAmount * 0.025; // 2.5% international payment fee
  const total = baseAmount + internationalFee;
  return {
    baseAmount,
    internationalFee,
    total: Number(total.toFixed(2)),
  };
}