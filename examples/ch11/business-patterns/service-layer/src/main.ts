/**
 * Demo of Service Layer Pattern
 */

import {
  OrderService,
  ConsoleEmailService,
  SimpleInventoryService
} from './services/order-service';
import {
  InMemoryOrderRepository,
  InMemoryProductRepository,
  InMemoryCustomerRepository
} from './repositories/repositories';

console.log('='.repeat(70));
console.log('Service Layer Pattern - Order Processing Demo');
console.log('='.repeat(70));
console.log('\nThe Service Layer orchestrates domain objects, manages transactions,');
console.log('and provides a clear API for the presentation layer.\n');

// Setup dependencies (Dependency Injection)
const orderRepo = new InMemoryOrderRepository();
const productRepo = new InMemoryProductRepository();
const customerRepo = new InMemoryCustomerRepository();
const emailService = new ConsoleEmailService();
const inventoryService = new SimpleInventoryService(productRepo);

// Create the service
const orderService = new OrderService(
  orderRepo,
  productRepo,
  customerRepo,
  emailService,
  inventoryService
);

// Demo execution
async function runDemo() {
  try {
    // Example 1: Create a simple order
    console.log('\n--- Example 1: Create Simple Order ---');
    const order1 = await orderService.createOrder({
      customerId: 101,
      items: [
        { productId: 1, quantity: 1 }, // Laptop
        { productId: 2, quantity: 2 }  // Mouse
      ]
    });
    
    console.log(`\n✅ Order created:`, {
      orderId: order1.orderId,
      customer: order1.customerName,
      total: `$${order1.total.toFixed(2)}`,
      itemCount: order1.items.length
    });
    
    // Example 2: Create another order
    console.log('\n--- Example 2: Create Order with Multiple Items ---');
    const order2 = await orderService.createOrder({
      customerId: 102,
      items: [
        { productId: 3, quantity: 1 }, // Keyboard
        { productId: 4, quantity: 2 }  // Monitor
      ]
    });
    
    console.log(`\n✅ Order created:`, {
      orderId: order2.orderId,
      customer: order2.customerName,
      total: `$${order2.total.toFixed(2)}`
    });
    
    // Example 3: Retrieve an order
    console.log('\n--- Example 3: Retrieve Order ---');
    const retrieved = await orderService.getOrder(order1.orderId);
    if (retrieved) {
      console.log(`\n📋 Order #${retrieved.orderId} details:`);
      console.log(`   Customer: ${retrieved.customerName}`);
      console.log(`   Items:`);
      retrieved.items.forEach(item => {
        console.log(`     - ${item.quantity}x ${item.productName} @ $${item.price} = $${item.total.toFixed(2)}`);
      });
      console.log(`   Total: $${retrieved.total.toFixed(2)}`);
    }
    
    // Example 4: Get customer order history
    console.log('\n--- Example 4: Customer Order History ---');
    const aliceOrders = await orderService.getCustomerOrders(101);
    console.log(`\n📊 Alice Johnson has ${aliceOrders.length} order(s):`);
    aliceOrders.forEach(order => {
      console.log(`   Order #${order.orderId}: $${order.total.toFixed(2)} (${order.items.length} items)`);
    });
    
    // Example 5: Error handling - Invalid customer
    console.log('\n--- Example 5: Error Handling (Invalid Customer) ---');
    try {
      await orderService.createOrder({
        customerId: 999,
        items: [{ productId: 1, quantity: 1 }]
      });
    } catch (error) {
      console.log(`\n❌ Error caught: ${(error as Error).message}`);
    }
    
    // Example 6: Error handling - Invalid product
    console.log('\n--- Example 6: Error Handling (Invalid Product) ---');
    try {
      await orderService.createOrder({
        customerId: 101,
        items: [{ productId: 999, quantity: 1 }]
      });
    } catch (error) {
      console.log(`\n❌ Error caught: ${(error as Error).message}`);
    }
    
    // Example 7: Error handling - Insufficient stock
    console.log('\n--- Example 7: Error Handling (Insufficient Stock) ---');
    try {
      await orderService.createOrder({
        customerId: 101,
        items: [{ productId: 1, quantity: 1000 }] // Way more than available
      });
    } catch (error) {
      console.log(`\n❌ Error caught: ${(error as Error).message}`);
    }
    
    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('🎯 Service Layer Benefits Demonstrated:');
    console.log('='.repeat(70));
    console.log('✓ Clear transaction boundaries (createOrder method)');
    console.log('✓ Coordination of multiple repositories and services');
    console.log('✓ Business rule enforcement (validation, inventory checks)');
    console.log('✓ Error handling and rollback capability');
    console.log('✓ DTO pattern for data transfer across boundaries');
    console.log('✓ Dependency injection for testability');
    console.log('\n✨ Demo completed!\n');
    
  } catch (error) {
    console.error('Demo failed:', error);
  }
}

runDemo();
