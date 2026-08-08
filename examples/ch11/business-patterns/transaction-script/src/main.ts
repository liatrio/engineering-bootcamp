/**
 * Demo of Transaction Script Pattern
 */

import { processOrder, OrderData, getCustomerOrders, calculateTotalRevenue } from './order-processing';

console.log('='.repeat(60));
console.log('Transaction Script Pattern - Order Processing Demo');
console.log('='.repeat(60));

// Example 1: Simple order
const order1: OrderData = {
  customerId: 101,
  customerName: 'Alice Johnson',
  items: [
    { productId: 1, productName: 'Laptop', price: 999.99, quantity: 1 },
    { productId: 2, productName: 'Mouse', price: 29.99, quantity: 2 }
  ]
};

processOrder(order1);

// Example 2: Order with coupon
const order2: OrderData = {
  customerId: 102,
  customerName: 'Bob Smith',
  items: [
    { productId: 3, productName: 'Keyboard', price: 89.99, quantity: 1 },
    { productId: 4, productName: 'Monitor', price: 299.99, quantity: 1 }
  ],
  couponCode: 'SAVE20'
};

processOrder(order2);

// Example 3: Multiple items with discount
const order3: OrderData = {
  customerId: 101,
  customerName: 'Alice Johnson',
  items: [
    { productId: 5, productName: 'Desk Chair', price: 199.99, quantity: 1 },
    { productId: 6, productName: 'Desk Lamp', price: 39.99, quantity: 2 }
  ],
  couponCode: 'WELCOME'
};

processOrder(order3);

// Example 4: Show customer order history
console.log('\n' + '='.repeat(60));
console.log('Customer Order History');
console.log('='.repeat(60));

const aliceOrders = getCustomerOrders(101);
console.log(`\nAlice Johnson has ${aliceOrders.length} orders:`);
aliceOrders.forEach(order => {
  console.log(`  Order #${order.orderId}: $${order.total.toFixed(2)}`);
});

// Example 5: Show total revenue
console.log('\n' + '='.repeat(60));
console.log(`Total Revenue: $${calculateTotalRevenue().toFixed(2)}`);
console.log('='.repeat(60));

// Example 6: Error handling
console.log('\n' + '='.repeat(60));
console.log('Error Handling Demo');
console.log('='.repeat(60));

try {
  const invalidOrder: OrderData = {
    customerId: 103,
    customerName: 'Charlie Brown',
    items: []
  };
  processOrder(invalidOrder);
} catch (error) {
  console.log(`\n❌ Error caught: ${(error as Error).message}`);
}

console.log('\n✨ Demo completed!\n');
