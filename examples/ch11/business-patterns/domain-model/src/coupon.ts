/**
 * Domain Model Pattern - Coupon
 * 
 * Represents a discount coupon with validation and calculation logic
 */

export class Coupon {
  constructor(
    private readonly code: string,
    private readonly discountPercent: number,
    private readonly expiryDate: Date,
    private readonly minOrderAmount: number = 0
  ) {
    if (discountPercent < 0 || discountPercent > 100) {
      throw new Error('Discount percent must be between 0 and 100');
    }
  }
  
  getCode(): string {
    return this.code;
  }
  
  getDiscountPercent(): number {
    return this.discountPercent;
  }
  
  /**
   * Checks if the coupon is currently valid
   */
  isValid(): boolean {
    return new Date() <= this.expiryDate;
  }
  
  /**
   * Checks if the coupon can be applied to an order with given amount
   */
  canApplyTo(orderAmount: number): boolean {
    return this.isValid() && orderAmount >= this.minOrderAmount;
  }
  
  /**
   * Calculates the discount amount for a given order total
   */
  calculateDiscount(orderAmount: number): number {
    if (!this.canApplyTo(orderAmount)) {
      return 0;
    }
    return orderAmount * (this.discountPercent / 100);
  }
}
