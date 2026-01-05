/**
 * Observer Pattern Demo - Stock Price Monitoring
 * 
 * This demo shows how the Observer pattern enables loose coupling between
 * a subject (stock price) and its observers (displays, alerts, loggers).
 */

import { StockPrice } from './subject';
import { ChartDisplay, TableDisplay, AlertSystem, Logger } from './observer';

function main() {
  console.log('=== Observer Pattern Demo: Stock Price Monitoring ===\n');

  // Create the subject (observable)
  const appleStock = new StockPrice('AAPL', 150.00);

  // Create observers
  const chart = new ChartDisplay('Apple Chart');
  const table = new TableDisplay('Apple Table');
  const alertHigh = new AlertSystem(180.00, 'High Price Alert');
  const logger = new Logger('Apple Price Logger');

  console.log('--- Example 1: Attaching Observers ---');
  appleStock.attach(chart);
  appleStock.attach(table);
  appleStock.attach(alertHigh);
  appleStock.attach(logger);

  console.log(`\nTotal observers: ${appleStock.getObserverCount()}`);

  // Example 2: Price changes notify all observers
  console.log('\n--- Example 2: Price Changes Notify All Observers ---');
  appleStock.setPrice(155.50);
  appleStock.setPrice(162.25);
  appleStock.setPrice(158.75);

  // Example 3: Price crosses alert threshold
  console.log('\n--- Example 3: Price Crosses Alert Threshold ---');
  appleStock.setPrice(185.00);  // Should trigger alert

  // Example 4: Dynamic observer management
  console.log('\n--- Example 4: Detaching an Observer ---');
  console.log('Detaching table display...');
  appleStock.detach(table);
  
  console.log('\nPrice change after detaching table:');
  appleStock.setPrice(190.50);  // Table won't be notified

  // Example 5: Reattaching observer
  console.log('\n--- Example 5: Reattaching Observer ---');
  console.log('Reattaching table display...');
  appleStock.attach(table);
  
  console.log('\nPrice change after reattaching table:');
  appleStock.setPrice(192.75);  // Table will be notified again

  // Example 6: Adding new observer at runtime
  console.log('\n--- Example 6: Adding New Observer at Runtime ---');
  const alertLow = new AlertSystem(160.00, 'Low Price Alert');
  appleStock.attach(alertLow);
  
  console.log('\nPrice drop below new threshold:');
  appleStock.setPrice(155.00);  // Should trigger low price alert

  // Example 7: Multiple stocks, independent observers
  console.log('\n--- Example 7: Multiple Stocks with Independent Observers ---');
  const googleStock = new StockPrice('GOOGL', 120.00);
  const googleChart = new ChartDisplay('Google Chart');
  const googleLogger = new Logger('Google Price Logger');
  
  googleStock.attach(googleChart);
  googleStock.attach(googleLogger);
  
  console.log('\nUpdating Google stock (Apple observers not notified):');
  googleStock.setPrice(125.50);
  
  console.log('\nUpdating Apple stock (Google observers not notified):');
  appleStock.setPrice(157.25);

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Demo completed!');
  console.log('='.repeat(60));
  console.log('\nKey Takeaways:');
  console.log('1. Subject (StockPrice) is loosely coupled to observers');
  console.log('2. Observers can be attached/detached dynamically at runtime');
  console.log('3. One change in subject notifies ALL observers automatically');
  console.log('4. Subject depends on Observer interface, not concrete types (DIP)');
  console.log('5. Each observer can react differently to the same notification');
  console.log('6. Multiple subjects can have independent observer lists');
}

// Run the demo
main();
