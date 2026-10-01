import { Order, OrderItem, OrderStatus } from '../src/order';
import { Customer } from '../src/customer';
import { Product } from '../src/product';
import { Coupon } from '../src/coupon';

describe('Domain Model - Order System', () => {
  
  let customer: Customer;
  let vipCustomer: Customer;
  let product1: Product;
  let product2: Product;
  
  beforeEach(() => {
    customer = new Customer(1, 'Test User', 'test@example.com', false);
    vipCustomer = new Customer(2, 'VIP User', 'vip@example.com', true);
    product1 = new Product(101, 'Product A', 50.00, 'Category A');
    product2 = new Product(102, 'Product B', 30.00, 'Category B');
  });
  
  describe('Customer', () => {
    it('should provide VIP discount rate', () => {
      expect(vipCustomer.getDiscountRate()).toBe(0.05);
    });
    
    it('should not provide discount for regular customers', () => {
      expect(customer.getDiscountRate()).toBe(0);
    });
  });
  
  describe('Product', () => {
    it('should not allow negative price', () => {
      expect(() => new Product(1, 'Invalid', -10, 'Category')).toThrow('Price cannot be negative');
    });
  });
  
  describe('Coupon', () => {
    it('should calculate discount correctly', () => {
      const coupon = new Coupon('TEST10', 10, new Date('2026-12-31'));
      expect(coupon.calculateDiscount(100)).toBe(10);
    });
    
    it('should validate expiry date', () => {
      const expiredCoupon = new Coupon('EXPIRED', 10, new Date('2020-01-01'));
      expect(expiredCoupon.isValid()).toBe(false);
    });
    
    it('should check minimum order amount', () => {
      const coupon = new Coupon('MIN50', 10, new Date('2026-12-31'), 50);
      expect(coupon.canApplyTo(40)).toBe(false);
      expect(coupon.canApplyTo(60)).toBe(true);
    });
    
    it('should not allow invalid discount percentage', () => {
      expect(() => new Coupon('INVALID', 150, new Date('2026-12-31'))).toThrow();
      expect(() => new Coupon('INVALID', -10, new Date('2026-12-31'))).toThrow();
    });
  });
  
  describe('OrderItem', () => {
    it('should calculate total correctly', () => {
      const item = new OrderItem(product1, 2);
      expect(item.getTotal()).toBe(100);
    });
    
    it('should not allow zero or negative quantity', () => {
      expect(() => new OrderItem(product1, 0)).toThrow('Quantity must be greater than 0');
      expect(() => new OrderItem(product1, -1)).toThrow('Quantity must be greater than 0');
    });
  });
  
  describe('Order', () => {
    it('should add items correctly', () => {
      const order = new Order(customer);
      order.addItem(product1, 2);
      order.addItem(product2, 1);
      
      expect(order.getItems().length).toBe(2);
    });
    
    it('should calculate subtotal correctly', () => {
      const order = new Order(customer);
      order.addItem(product1, 2); // $100
      order.addItem(product2, 1); // $30
      
      expect(order.calculateSubtotal()).toBe(130);
    });
    
    it('should apply VIP discount', () => {
      const order = new Order(vipCustomer);
      order.addItem(product1, 2); // $100
      
      const subtotal = order.calculateSubtotal();
      const discount = order.calculateTotalDiscount();
      
      expect(discount).toBe(5); // 5% of $100
      expect(order.calculateTotal()).toBe(95);
    });
    
    it('should apply coupon discount', () => {
      const coupon = new Coupon('SAVE20', 20, new Date('2026-12-31'));
      const order = new Order(customer);
      order.addItem(product1, 2); // $100
      order.applyCoupon(coupon);
      
      const discount = order.calculateTotalDiscount();
      
      expect(discount).toBe(20); // 20% of $100
      expect(order.calculateTotal()).toBe(80);
    });
    
    it('should stack VIP and coupon discounts', () => {
      const coupon = new Coupon('SAVE10', 10, new Date('2026-12-31'));
      const order = new Order(vipCustomer);
      order.addItem(product1, 2); // $100
      order.applyCoupon(coupon);
      
      const discount = order.calculateTotalDiscount();
      
      expect(discount).toBe(15); // 10% coupon + 5% VIP = 15% of $100
      expect(order.calculateTotal()).toBe(85);
    });
    
    it('should remove items correctly', () => {
      const order = new Order(customer);
      order.addItem(product1, 1);
      order.addItem(product2, 1);
      
      expect(order.getItems().length).toBe(2);
      
      order.removeItem(product1.getId());
      
      expect(order.getItems().length).toBe(1);
      expect(order.calculateSubtotal()).toBe(30); // Only product2 remains
    });
    
    it('should not allow modifications after processing starts', () => {
      const order = new Order(customer);
      order.addItem(product1, 1);
      order.process();
      
      expect(() => order.addItem(product2, 1)).toThrow('Cannot modify order after processing has started');
    });
    
    it('should not allow processing empty order', () => {
      const order = new Order(customer);
      
      expect(() => order.process()).toThrow('Order must have at least one item');
    });
    
    it('should not allow double processing', () => {
      const order = new Order(customer);
      order.addItem(product1, 1);
      order.process();
      
      expect(() => order.process()).toThrow('Order has already been processed');
    });
    
    it('should transition through status states correctly', () => {
      const order = new Order(customer);
      
      expect(order.getStatus()).toBe(OrderStatus.PENDING);
      
      order.addItem(product1, 1);
      order.process();
      
      expect(order.getStatus()).toBe(OrderStatus.PROCESSING);
      
      order.complete();
      
      expect(order.getStatus()).toBe(OrderStatus.COMPLETED);
    });
    
    it('should allow cancellation before completion', () => {
      const order = new Order(customer);
      order.addItem(product1, 1);
      order.process();
      order.cancel();
      
      expect(order.getStatus()).toBe(OrderStatus.CANCELLED);
    });
    
    it('should not allow cancellation of completed order', () => {
      const order = new Order(customer);
      order.addItem(product1, 1);
      order.process();
      order.complete();
      
      expect(() => order.cancel()).toThrow('Cannot cancel completed order');
    });
    
    it('should reject invalid coupon', () => {
      const expiredCoupon = new Coupon('EXPIRED', 10, new Date('2020-01-01'));
      const order = new Order(customer);
      order.addItem(product1, 1);
      
      expect(() => order.applyCoupon(expiredCoupon)).toThrow('Coupon cannot be applied');
    });
    
    it('should protect encapsulation of items array', () => {
      const order = new Order(customer);
      order.addItem(product1, 1);
      
      const items = order.getItems();
      const originalLength = items.length;
      
      // Try to modify the returned array
      items.push(new OrderItem(product2, 1));
      
      // Original order should be unchanged
      expect(order.getItems().length).toBe(originalLength);
    });
  });
});
