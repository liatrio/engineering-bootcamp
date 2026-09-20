import { IShippingStrategy } from '../strategies/shipping/IShippingStrategy';
import { StandardShipping } from '../strategies/shipping/StandardShipping';
import { ExpressShipping } from '../strategies/shipping/ExpressShipping';
import { OvernightShipping } from '../strategies/shipping/OvernightShipping';

/**
 * Factory for creating shipping strategy instances
 * Demonstrates Factory Pattern and enables Open/Closed Principle:
 * - Can add new shipping methods by registering them
 * - Existing code doesn't need modification
 */
export class ShippingStrategyFactory {
  private strategies: Map<string, () => IShippingStrategy> = new Map();

  constructor() {
    // Register default shipping strategies
    this.registerStrategy('standard', () => new StandardShipping());
    this.registerStrategy('express', () => new ExpressShipping());
    this.registerStrategy('overnight', () => new OvernightShipping());
  }

  /**
   * Register a new shipping strategy
   * This method enables extension without modification (OCP)
   * @param method Shipping method identifier
   * @param factory Function that creates the strategy instance
   */
  registerStrategy(method: string, factory: () => IShippingStrategy): void {
    this.strategies.set(method, factory);
  }

  /**
   * Get a shipping strategy by method
   * @param method Shipping method (e.g., 'standard', 'express', 'overnight')
   * @returns Shipping strategy instance
   * @throws Error if shipping method is not supported
   */
  getStrategy(method: string): IShippingStrategy {
    const factory = this.strategies.get(method);
    
    if (!factory) {
      throw new Error(`Unsupported shipping method: ${method}`);
    }
    
    return factory();
  }

  /**
   * Check if a shipping method is supported
   * @param method Shipping method to check
   * @returns true if supported, false otherwise
   */
  isSupported(method: string): boolean {
    return this.strategies.has(method);
  }

  /**
   * Get list of all supported shipping methods
   * @returns Array of supported shipping method strings
   */
  getSupportedMethods(): string[] {
    return Array.from(this.strategies.keys());
  }
}
