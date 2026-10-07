import { IShippingStrategy } from './IShippingStrategy';

/**
 * Standard Shipping Strategy
 * $5.99 cost, 7-day delivery
 */
export class StandardShipping implements IShippingStrategy {
  private readonly cost = 5.99;
  private readonly deliveryDays = 7;

  calculateCost(): number {
    return this.cost;
  }

  getDeliveryDays(): number {
    return this.deliveryDays;
  }

  getMethod(): string {
    return 'standard';
  }
}
