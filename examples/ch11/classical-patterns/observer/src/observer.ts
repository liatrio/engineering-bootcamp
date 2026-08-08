/**
 * Observer Pattern - Observer Interface and Concrete Observers
 * 
 * The Observer interface defines the contract that all observers must implement.
 * Concrete observers implement this interface to receive updates from subjects.
 */

/**
 * Observer interface defines the contract for receiving updates.
 * This is a small, focused interface (Interface Segregation Principle).
 */
export interface Observer {
  /**
   * Called when the subject's state changes.
   * @param price - The new stock price
   */
  update(price: number): void;
  
  /**
   * Returns the name of this observer for identification.
   */
  getName(): string;
}

/**
 * ChartDisplay shows stock price in a visual chart format.
 * In a real application, this would render an actual chart.
 */
export class ChartDisplay implements Observer {
  private name: string;
  private history: number[] = [];

  constructor(name: string = "Chart Display") {
    this.name = name;
  }

  update(price: number): void {
    this.history.push(price);
    console.log(`📊 ${this.name}: Price updated to $${price.toFixed(2)}`);
    
    // Show mini chart with last 5 prices
    const recent = this.history.slice(-5);
    const chart = recent.map(p => `$${p.toFixed(2)}`).join(" → ");
    console.log(`   Trend: ${chart}`);
  }

  getName(): string {
    return this.name;
  }

  getHistory(): number[] {
    return [...this.history];
  }
}

/**
 * TableDisplay shows stock price in a tabular format.
 * This is a different visualization of the same data.
 */
export class TableDisplay implements Observer {
  private name: string;
  private updateCount: number = 0;
  private lastPrice: number = 0;

  constructor(name: string = "Table Display") {
    this.name = name;
  }

  update(price: number): void {
    this.updateCount++;
    const change = this.lastPrice > 0 ? price - this.lastPrice : 0;
    const changePercent = this.lastPrice > 0 
      ? ((change / this.lastPrice) * 100).toFixed(2) 
      : "0.00";
    
    console.log(`📋 ${this.name}: Update #${this.updateCount}`);
    console.log(`   Price: $${price.toFixed(2)} | Change: $${change.toFixed(2)} (${changePercent}%)`);
    
    this.lastPrice = price;
  }

  getName(): string {
    return this.name;
  }

  getUpdateCount(): number {
    return this.updateCount;
  }
}

/**
 * AlertSystem monitors price and sends alerts when thresholds are crossed.
 * This demonstrates conditional observer logic.
 */
export class AlertSystem implements Observer {
  private name: string;
  private threshold: number;
  private alerts: string[] = [];

  constructor(threshold: number, name: string = "Alert System") {
    this.name = name;
    this.threshold = threshold;
  }

  update(price: number): void {
    if (price > this.threshold) {
      const alert = `⚠️  ${this.name}: ALERT! Price $${price.toFixed(2)} exceeded threshold $${this.threshold.toFixed(2)}`;
      console.log(alert);
      this.alerts.push(alert);
    } else {
      console.log(`✓  ${this.name}: Price $${price.toFixed(2)} within normal range (threshold: $${this.threshold.toFixed(2)})`);
    }
  }

  getName(): string {
    return this.name;
  }

  getAlerts(): string[] {
    return [...this.alerts];
  }

  getThreshold(): number {
    return this.threshold;
  }
}

/**
 * Logger observer records all price changes to a log.
 * This demonstrates the flexibility of the Observer pattern -
 * we can add logging without modifying the subject.
 */
export class Logger implements Observer {
  private name: string;
  private logs: string[] = [];

  constructor(name: string = "Price Logger") {
    this.name = name;
  }

  update(price: number): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] Price: $${price.toFixed(2)}`;
    this.logs.push(logEntry);
    console.log(`📝 ${this.name}: ${logEntry}`);
  }

  getName(): string {
    return this.name;
  }

  getLogs(): string[] {
    return [...this.logs];
  }
}
