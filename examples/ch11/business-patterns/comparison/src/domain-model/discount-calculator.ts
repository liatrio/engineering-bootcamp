/**
 * Domain Model Approach
 * Discount Calculation using Strategy Pattern
 */

/**
 * Base interface for discount strategies
 */
export interface DiscountStrategy {
  calculate(order: Order): number;
  getDescription(): string;
}

/**
 * Volume-based discount strategy
 */
export class VolumeDiscount implements DiscountStrategy {
  calculate(order: Order): number {
    const total = order.getTotal();
    if (total > 500) return total * 0.15;
    if (total > 200) return total * 0.10;
    if (total > 100) return total * 0.05;
    return 0;
  }
  
  getDescription(): string {
    return 'Volume Discount (5-15% based on order total)';
  }
}

/**
 * Customer type discount strategy
 */
export class CustomerTypeDiscount implements DiscountStrategy {
  constructor(private customerType: 'VIP' | 'REGULAR') {}
  
  calculate(order: Order): number {
    if (this.customerType === 'VIP') {
      return order.getTotal() * 0.10;
    }
    return 0;
  }
  
  getDescription(): string {
    return this.customerType === 'VIP' ? 'VIP Customer Discount (10%)' : 'No Customer Discount';
  }
}

/**
 * Bulk item discount strategy
 */
export class BulkItemDiscount implements DiscountStrategy {
  calculate(order: Order): number {
    if (order.getItemCount() >= 10) {
      return order.getTotal() * 0.05;
    }
    return 0;
  }
  
  getDescription(): string {
    return 'Bulk Item Discount (5% for 10+ items)';
  }
}

/**
 * Coupon discount strategy
 */
export class CouponDiscount implements DiscountStrategy {
  constructor(private couponCode: string) {}
  
  calculate(order: Order): number {
    const total = order.getTotal();
    switch (this.couponCode.toUpperCase()) {
      case 'SAVE15':
        return total * 0.15;
      case 'SAVE25':
        return total * 0.25;
      case 'FIRSTORDER':
        return total * 0.20;
      default:
        return 0;
    }
  }
  
  getDescription(): string {
    return `Coupon Discount (${this.couponCode})`;
  }
}

/**
 * Discount policy - manages multiple discount strategies
 */
export class DiscountPolicy {
  private strategies: DiscountStrategy[] = [];
  private readonly maxDiscountRate = 0.40; // 40% max
  
  addStrategy(strategy: DiscountStrategy): void {
    this.strategies.push(strategy);
  }
  
  calculateTotalDiscount(order: Order): number {
    let totalDiscount = 0;
    
    for (const strategy of this.strategies) {
      totalDiscount += strategy.calculate(order);
    }
    
    // Apply cap
    const maxDiscount = order.getTotal() * this.maxDiscountRate;
    return Math.min(totalDiscount, maxDiscount);
  }
  
  getAppliedDiscounts(order: Order): Array<{ description: string; amount: number }> {
    return this.strategies
      .map(strategy => ({
        description: strategy.getDescription(),
        amount: strategy.calculate(order)
      }))
      .filter(discount => discount.amount > 0);
  }
}

/**
 * Order domain object
 */
export class Order {
  private discountPolicy: DiscountPolicy;
  
  constructor(
    private readonly orderTotal: number,
    private readonly itemCount: number,
    private readonly customerType: 'VIP' | 'REGULAR',
    couponCode?: string
  ) {
    this.discountPolicy = new DiscountPolicy();
    
    // Configure discount strategies
    this.discountPolicy.addStrategy(new VolumeDiscount());
    this.discountPolicy.addStrategy(new CustomerTypeDiscount(customerType));
    this.discountPolicy.addStrategy(new BulkItemDiscount());
    
    if (couponCode) {
      this.discountPolicy.addStrategy(new CouponDiscount(couponCode));
    }
  }
  
  getTotal(): number {
    return this.orderTotal;
  }
  
  getItemCount(): number {
    return this.itemCount;
  }
  
  getCustomerType(): 'VIP' | 'REGULAR' {
    return this.customerType;
  }
  
  calculateDiscount(): number {
    return this.discountPolicy.calculateTotalDiscount(this);
  }
  
  calculateFinalPrice(): number {
    return this.orderTotal - this.calculateDiscount();
  }
  
  getDiscountBreakdown(): Array<{ description: string; amount: number }> {
    return this.discountPolicy.getAppliedDiscounts(this);
  }
}
