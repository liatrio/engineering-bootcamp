/**
 * Demo of Domain Model Pattern
 */

import { Customer } from './customer';
import { Product } from './product';
import { Coupon } from './coupon';
import { Order } from './order';

console.log('='.repeat(60));
console.log('Domain Model Pattern - Order Processing Demo');
console.log('='.repeat(60));

// Create domain objects
const alice = new Customer(101, 'Alice Johnson', 'alice@example.com', true);
const bob = new Customer(102, 'Bob Smith', 'bob@example.com', false);

const laptop = new Product(1, 'Laptop', 999.99, 'Electronics');
const mouse = new Product(2, 'Wireless Mouse', 29.99, 'Accessories');
const keyboard = new Product(3, 'Mechanical Keyboard', 89.99, 'Accessories');
const monitor = new Product(4, '27" Monitor', 299.99, 'Electronics');

// Example 1: Simple order for VIP customer
console.log('\n--- Example 1: VIP Customer Order ---');
const order1 = new Order(alice, 1);
order1.addItem(laptop, 1);
order1.addItem(mouse, 2);
order1.process();
order1.complete();

// Example 2: Order with coupon
console.log('\n--- Example 2: Order with Coupon ---');
const saveCoupon = new Coupon('SAVE20', 20, new Date('2026-12-31'), 50);
const order2 = new Order(bob, 2);
order2.addItem(keyboard, 1);
order2.addItem(monitor, 1);
order2.applyCoupon(saveCoupon);
order2.process();
order2.complete();

// Example 3: VIP customer with coupon (stacking discounts)
console.log('\n--- Example 3: VIP + Coupon Stacking ---');
const welcomeCoupon = new Coupon('WELCOME15', 15, new Date('2026-12-31'));
const order3 = new Order(alice, 3);
order3.addItem(monitor, 2);
order3.applyCoupon(welcomeCoupon);
order3.process();
order3.complete();

// Example 4: Modifying order before processing
console.log('\n--- Example 4: Order Modification ---');
const order4 = new Order(bob, 4);
order4.addItem(laptop, 1);
order4.addItem(mouse, 1);
console.log(`Items before removal: ${order4.getItems().length}`);
order4.removeItem(mouse.getId());
console.log(`Items after removal: ${order4.getItems().length}`);
order4.process();
order4.complete();

// Example 5: Order cancellation
console.log('\n--- Example 5: Order Cancellation ---');
const order5 = new Order(alice, 5);
order5.addItem(keyboard, 1);
order5.process();
console.log('Cancelling order before completion...');
order5.cancel();

// Example 6: Error handling - invalid coupon
console.log('\n--- Example 6: Error Handling ---');
try {
  const expiredCoupon = new Coupon('EXPIRED', 10, new Date('2020-01-01'));
  const order6 = new Order(bob, 6);
  order6.addItem(laptop, 1);
  order6.applyCoupon(expiredCoupon);
} catch (error) {
  console.log(`❌ Error caught: ${(error as Error).message}`);
}

// Example 7: Error handling - modifying processed order
console.log('\n--- Example 7: Cannot Modify Processed Order ---');
try {
  const order7 = new Order(alice, 7);
  order7.addItem(laptop, 1);
  order7.process();
  order7.addItem(mouse, 1); // This should fail
} catch (error) {
  console.log(`❌ Error caught: ${(error as Error).message}`);
}

// Example 8: Business logic encapsulation demo
console.log('\n' + '='.repeat(60));
console.log('Business Logic Encapsulation Demo');
console.log('='.repeat(60));

const vipCustomer = new Customer(200, 'VIP User', 'vip@example.com', true);
const regularCustomer = new Customer(201, 'Regular User', 'regular@example.com', false);

console.log(`\n${vipCustomer.getName()} discount rate: ${vipCustomer.getDiscountRate() * 100}%`);
console.log(`${regularCustomer.getName()} discount rate: ${regularCustomer.getDiscountRate() * 100}%`);

const bigOrder = new Order(vipCustomer, 8);
bigOrder.addItem(laptop, 2);
console.log(`\nOrder subtotal: $${bigOrder.calculateSubtotal().toFixed(2)}`);
console.log(`VIP discount: $${bigOrder.calculateTotalDiscount().toFixed(2)}`);
console.log(`Final total: $${bigOrder.calculateTotal().toFixed(2)}`);

console.log('\n✨ Demo completed!\n');
