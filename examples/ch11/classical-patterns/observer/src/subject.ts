/**
 * Observer Pattern - Subject (Observable)
 * 
 * The Subject maintains a list of observers and notifies them of state changes.
 * This demonstrates loose coupling: the subject only knows about the Observer
 * interface, not concrete observer types.
 */

import { Observer } from './observer';

/**
 * StockPrice is the Subject in the Observer pattern.
 * It maintains the current price and notifies all observers when it changes.
 * 
 * Key characteristics:
 * - Depends on Observer INTERFACE, not concrete types (Dependency Inversion)
 * - Can have any number of observers attached/detached at runtime
 * - Doesn't know what observers do with the information (loose coupling)
 */
export class StockPrice {
  private price: number = 0;
  private observers: Observer[] = [];
  private symbol: string;

  constructor(symbol: string, initialPrice: number = 0) {
    this.symbol = symbol;
    this.price = initialPrice;
  }

  /**
   * Attach an observer to receive updates.
   * This can be done at any time, even after the subject has been running.
   */
  attach(observer: Observer): void {
    if (this.observers.includes(observer)) {
      console.log(`Observer ${observer.getName()} is already attached`);
      return;
    }
    
    this.observers.push(observer);
    console.log(`✓ Attached observer: ${observer.getName()}`);
  }

  /**
   * Detach an observer to stop receiving updates.
   * Demonstrates dynamic observer management.
   */
  detach(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index === -1) {
      console.log(`Observer ${observer.getName()} is not attached`);
      return;
    }
    
    this.observers.splice(index, 1);
    console.log(`✓ Detached observer: ${observer.getName()}`);
  }

  /**
   * Notify all attached observers of a price change.
   * This is the core of the Observer pattern - one change, many notifications.
   */
  private notify(): void {
    console.log(`\n📢 Notifying ${this.observers.length} observer(s) of price change...`);
    for (const observer of this.observers) {
      observer.update(this.price);
    }
    console.log(''); // Blank line for readability
  }

  /**
   * Set a new price and notify observers.
   * This is the method that triggers the observer notifications.
   */
  setPrice(newPrice: number): void {
    if (newPrice < 0) {
      throw new Error('Price cannot be negative');
    }
    
    const oldPrice = this.price;
    this.price = newPrice;
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`${this.symbol}: Price changed from $${oldPrice.toFixed(2)} to $${newPrice.toFixed(2)}`);
    console.log('='.repeat(60));
    
    this.notify();
  }

  /**
   * Get the current price.
   */
  getPrice(): number {
    return this.price;
  }

  /**
   * Get the stock symbol.
   */
  getSymbol(): string {
    return this.symbol;
  }

  /**
   * Get the number of attached observers.
   */
  getObserverCount(): number {
    return this.observers.length;
  }

  /**
   * Get list of attached observer names (for debugging/testing).
   */
  getObserverNames(): string[] {
    return this.observers.map(o => o.getName());
  }
}
