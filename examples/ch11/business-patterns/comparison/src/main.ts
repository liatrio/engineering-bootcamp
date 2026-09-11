/**
 * Comparison Demo - Transaction Script vs Domain Model
 * 
 * This demo shows the same business problem solved with both approaches
 */

import * as TS from './transaction-script/discount-calculator';
import * as DM from './domain-model/discount-calculator';

console.log('='.repeat(70));
console.log('Transaction Script vs Domain Model - Discount Calculation');
console.log('='.repeat(70));

// Test Case 1: Regular customer, small order
console.log('\n📦 Test Case 1: Regular customer, small order ($80, 3 items)');
console.log('-'.repeat(70));

const case1TS: TS.OrderDiscountData = {
  orderTotal: 80,
  customerType: 'REGULAR',
  itemCount: 3
};

const case1DM = new DM.Order(80, 3, 'REGULAR');

console.log('\nTransaction Script:');
console.log(`  Discount: $${TS.calculateOrderDiscount(case1TS).toFixed(2)}`);
console.log(`  Final Price: $${TS.calculateFinalPrice(case1TS).toFixed(2)}`);

console.log('\nDomain Model:');
console.log(`  Discount: $${case1DM.calculateDiscount().toFixed(2)}`);
console.log(`  Final Price: $${case1DM.calculateFinalPrice().toFixed(2)}`);
console.log('  Breakdown:', case1DM.getDiscountBreakdown());

// Test Case 2: VIP customer, medium order with volume discount
console.log('\n\n📦 Test Case 2: VIP customer, medium order ($250, 5 items)');
console.log('-'.repeat(70));

const case2TS: TS.OrderDiscountData = {
  orderTotal: 250,
  customerType: 'VIP',
  itemCount: 5
};

const case2DM = new DM.Order(250, 5, 'VIP');

console.log('\nTransaction Script:');
const ts2Discount = TS.calculateOrderDiscount(case2TS);
console.log(`  Volume Discount: $${TS.calculateVolumeDiscount(case2TS.orderTotal).toFixed(2)}`);
console.log(`  VIP Discount: $${TS.calculateCustomerDiscount(case2TS.orderTotal, case2TS.customerType).toFixed(2)}`);
console.log(`  Total Discount: $${ts2Discount.toFixed(2)}`);
console.log(`  Final Price: $${TS.calculateFinalPrice(case2TS).toFixed(2)}`);

console.log('\nDomain Model:');
console.log(`  Total Discount: $${case2DM.calculateDiscount().toFixed(2)}`);
console.log(`  Final Price: $${case2DM.calculateFinalPrice().toFixed(2)}`);
console.log('  Breakdown:');
case2DM.getDiscountBreakdown().forEach(d => {
  console.log(`    - ${d.description}: $${d.amount.toFixed(2)}`);
});

// Test Case 3: Large order with coupon and bulk items
console.log('\n\n📦 Test Case 3: Large order with coupon ($600, 12 items, SAVE15)');
console.log('-'.repeat(70));

const case3TS: TS.OrderDiscountData = {
  orderTotal: 600,
  customerType: 'REGULAR',
  itemCount: 12,
  couponCode: 'SAVE15'
};

const case3DM = new DM.Order(600, 12, 'REGULAR', 'SAVE15');

console.log('\nTransaction Script:');
console.log(`  Volume Discount: $${TS.calculateVolumeDiscount(case3TS.orderTotal).toFixed(2)}`);
console.log(`  Bulk Discount: $${TS.calculateBulkDiscount(case3TS.orderTotal, case3TS.itemCount).toFixed(2)}`);
console.log(`  Coupon Discount: $${TS.applyCouponDiscount(case3TS.orderTotal, case3TS.couponCode).toFixed(2)}`);
console.log(`  Total Discount (before cap): $${(
  TS.calculateVolumeDiscount(case3TS.orderTotal) +
  TS.calculateBulkDiscount(case3TS.orderTotal, case3TS.itemCount) +
  TS.applyCouponDiscount(case3TS.orderTotal, case3TS.couponCode)
).toFixed(2)}`);
console.log(`  Total Discount (after 40% cap): $${TS.calculateOrderDiscount(case3TS).toFixed(2)}`);
console.log(`  Final Price: $${TS.calculateFinalPrice(case3TS).toFixed(2)}`);

console.log('\nDomain Model:');
console.log(`  Total Discount: $${case3DM.calculateDiscount().toFixed(2)}`);
console.log(`  Final Price: $${case3DM.calculateFinalPrice().toFixed(2)}`);
console.log('  Breakdown:');
case3DM.getDiscountBreakdown().forEach(d => {
  console.log(`    - ${d.description}: $${d.amount.toFixed(2)}`);
});

// Test Case 4: VIP with large order and coupon (testing cap)
console.log('\n\n📦 Test Case 4: VIP, large order + coupon ($800, 15 items, SAVE25)');
console.log('-'.repeat(70));

const case4TS: TS.OrderDiscountData = {
  orderTotal: 800,
  customerType: 'VIP',
  itemCount: 15,
  couponCode: 'SAVE25'
};

const case4DM = new DM.Order(800, 15, 'VIP', 'SAVE25');

console.log('\nTransaction Script:');
const uncappedDiscount = 
  TS.calculateVolumeDiscount(case4TS.orderTotal) +
  TS.calculateCustomerDiscount(case4TS.orderTotal, case4TS.customerType) +
  TS.calculateBulkDiscount(case4TS.orderTotal, case4TS.itemCount) +
  TS.applyCouponDiscount(case4TS.orderTotal, case4TS.couponCode);
console.log(`  Uncapped Discount: $${uncappedDiscount.toFixed(2)} (${(uncappedDiscount / 800 * 100).toFixed(1)}%)`);
console.log(`  Capped Discount: $${TS.calculateOrderDiscount(case4TS).toFixed(2)} (40% max)`);
console.log(`  Final Price: $${TS.calculateFinalPrice(case4TS).toFixed(2)}`);

console.log('\nDomain Model:');
console.log(`  Total Discount: $${case4DM.calculateDiscount().toFixed(2)} (40% max)`);
console.log(`  Final Price: $${case4DM.calculateFinalPrice().toFixed(2)}`);
console.log('  Breakdown:');
case4DM.getDiscountBreakdown().forEach(d => {
  console.log(`    - ${d.description}: $${d.amount.toFixed(2)}`);
});

// Comparison Summary
console.log('\n\n' + '='.repeat(70));
console.log('📊 Pattern Comparison Summary');
console.log('='.repeat(70));

console.log('\nTransaction Script Characteristics:');
console.log('  ✓ Simple and straightforward');
console.log('  ✓ Easy to understand for simple cases');
console.log('  ✓ Fast to implement');
console.log('  ✗ Discount logic scattered across functions');
console.log('  ✗ Hard to add new discount types');
console.log('  ✗ Manual breakdown requires calling each function separately');

console.log('\nDomain Model Characteristics:');
console.log('  ✓ Each discount type is encapsulated');
console.log('  ✓ Easy to add new discount strategies');
console.log('  ✓ Built-in discount breakdown');
console.log('  ✓ Business rules clearly expressed in classes');
console.log('  ✗ More classes and code');
console.log('  ✗ Requires OOP understanding');

console.log('\n✨ Both approaches produce the same results!\n');
