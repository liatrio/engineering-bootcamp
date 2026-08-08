import { IShippingStrategy } from './IShippingStrategy';

/**
 * Express Shipping Strategy
 * $12.99 cost, 3-day delivery
 */
export class ExpressShipping implements IShippingStrategy {
  private readonly cost = 12.99;
  private readonly deliveryDays = 3;

  calculateCost(): number {
    return this.cost;
  }

  getDeliveryDays(): number {
    return this.deliveryDays;
  }

  getMethod(): string {
    return 'express';
  }
}
