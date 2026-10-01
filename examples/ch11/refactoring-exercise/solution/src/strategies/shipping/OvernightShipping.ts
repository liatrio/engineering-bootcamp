import { IShippingStrategy } from './IShippingStrategy';

/**
 * Overnight Shipping Strategy
 * $24.99 cost, 1-day delivery
 */
export class OvernightShipping implements IShippingStrategy {
  private readonly cost = 24.99;
  private readonly deliveryDays = 1;

  calculateCost(): number {
    return this.cost;
  }

  getDeliveryDays(): number {
    return this.deliveryDays;
  }

  getMethod(): string {
    return 'overnight';
  }
}
