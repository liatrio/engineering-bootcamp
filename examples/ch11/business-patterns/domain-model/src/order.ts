/**
 * Domain Model Pattern - Order
 * 
 * Rich domain object that encapsulates business logic for orders
 */

import { Customer } from './customer';
import { Product } from './product';
import { Coupon } from './coupon';

export class OrderItem {
  constructor(
    private readonly product: Product,
    private readonly quantity: number
  ) {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
  }
  
  getProduct(): Product {
    return this.product;
  }
  
  getQuantity(): number {
    return this.quantity;
  }
  
  /**
   * Calculates total for this line item
   */
  getTotal(): number {
    return this.product.getPrice() * this.quantity;
  }
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export class Order {
  private items: OrderItem[] = [];
  private coupon?: Coupon;
  private status: OrderStatus = OrderStatus.PENDING;
  private readonly orderId: number;
  private readonly createdAt: Date;
  
  constructor(
    private readonly customer: Customer,
    orderId?: number
  ) {
    this.orderId = orderId || Math.floor(Math.random() * 100000);
    this.createdAt = new Date();
  }
  
  getOrderId(): number {
    return this.orderId;
  }
  
  getCustomer(): Customer {
    return this.customer;
  }
  
  getStatus(): OrderStatus {
    return this.status;
  }
  
  getItems(): OrderItem[] {
    return [...this.items]; // Return copy to protect encapsulation
  }
  
  /**
   * Adds an item to the order
   */
  addItem(product: Product, quantity: number): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new Error('Cannot modify order after processing has started');
    }
    
    const item = new OrderItem(product, quantity);
    this.items.push(item);
  }
  
  /**
   * Removes an item from the order
   */
  removeItem(productId: number): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new Error('Cannot modify order after processing has started');
    }
    
    this.items = this.items.filter(item => item.getProduct().getId() !== productId);
  }
  
  /**
   * Applies a coupon to the order
   */
  applyCoupon(coupon: Coupon): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new Error('Cannot modify order after processing has started');
    }
    
    const subtotal = this.calculateSubtotal();
    if (!coupon.canApplyTo(subtotal)) {
      throw new Error('Coupon cannot be applied to this order');
    }
    
    this.coupon = coupon;
  }
  
  /**
   * Calculates the subtotal (sum of all items before discounts)
   */
  calculateSubtotal(): number {
    return this.items.reduce((sum, item) => sum + item.getTotal(), 0);
  }
  
  /**
   * Calculates total discount from all sources
   */
  calculateTotalDiscount(): number {
    const subtotal = this.calculateSubtotal();
    let discount = 0;
    
    // Coupon discount
    if (this.coupon) {
      discount += this.coupon.calculateDiscount(subtotal);
    }
    
    // Customer-specific discount (VIP)
    const customerDiscount = subtotal * this.customer.getDiscountRate();
    discount += customerDiscount;
    
    return discount;
  }
  
  /**
   * Calculates the final total after all discounts
   */
  calculateTotal(): number {
    const subtotal = this.calculateSubtotal();
    const discount = this.calculateTotalDiscount();
    return subtotal - discount;
  }
  
  /**
   * Validates the order before processing
   */
  private validate(): void {
    if (this.items.length === 0) {
      throw new Error('Order must have at least one item');
    }
  }
  
  /**
   * Processes the order
   */
  process(): void {
    this.validate();
    
    if (this.status !== OrderStatus.PENDING) {
      throw new Error('Order has already been processed');
    }
    
    this.status = OrderStatus.PROCESSING;
    console.log(`\n📦 Processing Order #${this.orderId}`);
    console.log(`   Customer: ${this.customer.getName()}`);
    console.log(`   Items: ${this.items.length}`);
    console.log(`   Subtotal: $${this.calculateSubtotal().toFixed(2)}`);
    
    const discount = this.calculateTotalDiscount();
    if (discount > 0) {
      console.log(`   Discount: -$${discount.toFixed(2)}`);
    }
    
    console.log(`   Total: $${this.calculateTotal().toFixed(2)}`);
  }
  
  /**
   * Completes the order
   */
  complete(): void {
    if (this.status !== OrderStatus.PROCESSING) {
      throw new Error('Order must be in processing state to complete');
    }
    
    this.status = OrderStatus.COMPLETED;
    console.log(`✅ Order #${this.orderId} completed`);
  }
  
  /**
   * Cancels the order
   */
  cancel(): void {
    if (this.status === OrderStatus.COMPLETED) {
      throw new Error('Cannot cancel completed order');
    }
    
    this.status = OrderStatus.CANCELLED;
    console.log(`❌ Order #${this.orderId} cancelled`);
  }
  
  /**
   * Gets order summary for display
   */
  getSummary(): string {
    return `Order #${this.orderId} - ${this.customer.getName()} - $${this.calculateTotal().toFixed(2)} (${this.status})`;
  }
}
