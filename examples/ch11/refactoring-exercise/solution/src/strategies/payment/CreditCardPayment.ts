import { IPaymentStrategy } from './IPaymentStrategy';

/**
 * Credit Card Payment Strategy
 * Charges a 3% processing fee on the subtotal
 */
export class CreditCardPayment implements IPaymentStrategy {
  private readonly feePercentage = 0.03; // 3%

  calculateFee(subtotal: number): number {
    const fee = subtotal * this.feePercentage;
    return Math.round(fee * 100) / 100; // Round to 2 decimal places
  }

  getType(): string {
    return 'credit_card';
  }
}
