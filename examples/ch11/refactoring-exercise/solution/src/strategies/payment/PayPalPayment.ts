import { IPaymentStrategy } from './IPaymentStrategy';

/**
 * PayPal Payment Strategy
 * Charges a 3.5% processing fee on the subtotal
 */
export class PayPalPayment implements IPaymentStrategy {
  private readonly feePercentage = 0.035; // 3.5%

  calculateFee(subtotal: number): number {
    const fee = subtotal * this.feePercentage;
    return Math.round(fee * 100) / 100; // Round to 2 decimal places
  }

  getType(): string {
    return 'paypal';
  }
}
