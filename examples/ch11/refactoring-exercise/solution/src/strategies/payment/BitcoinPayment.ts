import { IPaymentStrategy } from './IPaymentStrategy';

/**
 * Bitcoin Payment Strategy
 * Charges a flat $1.50 processing fee regardless of order size
 */
export class BitcoinPayment implements IPaymentStrategy {
  private readonly flatFee = 1.50;

  calculateFee(_subtotal: number): number {
    return this.flatFee;
  }

  getType(): string {
    return 'bitcoin';
  }
}
