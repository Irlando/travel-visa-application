export interface PaymentRequest {
  amount: number;
  currency: string;
  reference: string;
  description: string;
  returnUrl: string;
  cancelUrl: string;
}

export async function initiateSISPPayment(request: PaymentRequest) {
  // This is a placeholder for the actual SISP payment integration
  // You would need to replace this with the actual SISP API integration
  const response = await fetch('/api/payment/initiate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Payment initiation failed');
  }

  const data = await response.json();
  return data.paymentUrl;
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