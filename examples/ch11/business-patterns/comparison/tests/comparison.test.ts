import * as TS from '../src/transaction-script/discount-calculator';
import * as DM from '../src/domain-model/discount-calculator';

describe('Pattern Comparison - Both approaches produce same results', () => {
  
  describe('Case 1: Regular customer, small order', () => {
    const tsData: TS.OrderDiscountData = {
      orderTotal: 80,
      customerType: 'REGULAR',
      itemCount: 3
    };
    
    const dmOrder = new DM.Order(80, 3, 'REGULAR');
    
    it('should calculate same discount', () => {
      const tsDiscount = TS.calculateOrderDiscount(tsData);
      const dmDiscount = dmOrder.calculateDiscount();
      expect(tsDiscount).toBeCloseTo(dmDiscount, 2);
    });
    
    it('should calculate same final price', () => {
      const tsPrice = TS.calculateFinalPrice(tsData);
      const dmPrice = dmOrder.calculateFinalPrice();
      expect(tsPrice).toBeCloseTo(dmPrice, 2);
    });
  });
  
  describe('Case 2: VIP customer with volume discount', () => {
    const tsData: TS.OrderDiscountData = {
      orderTotal: 250,
      customerType: 'VIP',
      itemCount: 5
    };
    
    const dmOrder = new DM.Order(250, 5, 'VIP');
    
    it('should calculate same discount', () => {
      const tsDiscount = TS.calculateOrderDiscount(tsData);
      const dmDiscount = dmOrder.calculateDiscount();
      expect(tsDiscount).toBeCloseTo(dmDiscount, 2);
    });
    
    it('should calculate same final price', () => {
      const tsPrice = TS.calculateFinalPrice(tsData);
      const dmPrice = dmOrder.calculateFinalPrice();
      expect(tsPrice).toBeCloseTo(dmPrice, 2);
    });
  });
  
  describe('Case 3: Large order with coupon and bulk items', () => {
    const tsData: TS.OrderDiscountData = {
      orderTotal: 600,
      customerType: 'REGULAR',
      itemCount: 12,
      couponCode: 'SAVE15'
    };
    
    const dmOrder = new DM.Order(600, 12, 'REGULAR', 'SAVE15');
    
    it('should calculate same discount', () => {
      const tsDiscount = TS.calculateOrderDiscount(tsData);
      const dmDiscount = dmOrder.calculateDiscount();
      expect(tsDiscount).toBeCloseTo(dmDiscount, 2);
    });
    
    it('should apply 40% cap correctly', () => {
      const tsDiscount = TS.calculateOrderDiscount(tsData);
      const dmDiscount = dmOrder.calculateDiscount();
      const maxDiscount = 600 * 0.40;
      expect(tsDiscount).toBeLessThanOrEqual(maxDiscount);
      expect(dmDiscount).toBeLessThanOrEqual(maxDiscount);
    });
  });
  
  describe('Case 4: VIP with large order hitting discount cap', () => {
    const tsData: TS.OrderDiscountData = {
      orderTotal: 800,
      customerType: 'VIP',
      itemCount: 15,
      couponCode: 'SAVE25'
    };
    
    const dmOrder = new DM.Order(800, 15, 'VIP', 'SAVE25');
    
    it('should calculate same discount', () => {
      const tsDiscount = TS.calculateOrderDiscount(tsData);
      const dmDiscount = dmOrder.calculateDiscount();
      expect(tsDiscount).toBeCloseTo(dmDiscount, 2);
    });
    
    it('should both hit 40% cap', () => {
      const tsDiscount = TS.calculateOrderDiscount(tsData);
      const dmDiscount = dmOrder.calculateDiscount();
      const maxDiscount = 800 * 0.40;
      expect(tsDiscount).toBeCloseTo(maxDiscount, 2);
      expect(dmDiscount).toBeCloseTo(maxDiscount, 2);
    });
  });
  
  describe('Transaction Script - Individual functions', () => {
    it('should calculate volume discount tiers correctly', () => {
      expect(TS.calculateVolumeDiscount(50)).toBe(0);
      expect(TS.calculateVolumeDiscount(150)).toBe(7.5); // 5%
      expect(TS.calculateVolumeDiscount(250)).toBe(25); // 10%
      expect(TS.calculateVolumeDiscount(600)).toBe(90); // 15%
    });
    
    it('should calculate VIP discount', () => {
      expect(TS.calculateCustomerDiscount(100, 'VIP')).toBe(10);
      expect(TS.calculateCustomerDiscount(100, 'REGULAR')).toBe(0);
    });
    
    it('should calculate bulk discount', () => {
      expect(TS.calculateBulkDiscount(100, 5)).toBe(0);
      expect(TS.calculateBulkDiscount(100, 10)).toBe(5);
      expect(TS.calculateBulkDiscount(100, 15)).toBe(5);
    });
  });
  
  describe('Domain Model - Strategy pattern', () => {
    it('should provide discount breakdown', () => {
      const order = new DM.Order(250, 5, 'VIP');
      const breakdown = order.getDiscountBreakdown();
      
      expect(breakdown.length).toBeGreaterThan(0);
      expect(breakdown.every(d => d.amount >= 0)).toBe(true);
    });
    
    it('should allow adding new discount strategies', () => {
      // Create a custom discount strategy
      class SeasonalDiscount implements DM.DiscountStrategy {
        calculate(order: DM.Order): number {
          return order.getTotal() * 0.05;
        }
        getDescription(): string {
          return 'Seasonal Discount (5%)';
        }
      }
      
      // This demonstrates extensibility - easy to add new strategies
      const strategy = new SeasonalDiscount();
      expect(strategy.calculate(new DM.Order(100, 1, 'REGULAR'))).toBe(5);
    });
  });
});
