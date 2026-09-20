import { IPaymentStrategy } from '../strategies/payment/IPaymentStrategy';
import { CreditCardPayment } from '../strategies/payment/CreditCardPayment';
import { PayPalPayment } from '../strategies/payment/PayPalPayment';
import { BitcoinPayment } from '../strategies/payment/BitcoinPayment';

/**
 * Factory for creating payment strategy instances
 * Demonstrates Factory Pattern and enables Open/Closed Principle:
 * - Can add new payment types by registering them
 * - Existing code doesn't need modification
 */
export class PaymentStrategyFactory {
  private strategies: Map<string, () => IPaymentStrategy> = new Map();

  constructor() {
    // Register default payment strategies
    this.registerStrategy('credit_card', () => new CreditCardPayment());
    this.registerStrategy('paypal', () => new PayPalPayment());
    this.registerStrategy('bitcoin', () => new BitcoinPayment());
  }

  /**
   * Register a new payment strategy
   * This method enables extension without modification (OCP)
   * @param type Payment type identifier
   * @param factory Function that creates the strategy instance
   */
  registerStrategy(type: string, factory: () => IPaymentStrategy): void {
    this.strategies.set(type, factory);
  }

  /**
   * Get a payment strategy by type
   * @param type Payment type (e.g., 'credit_card', 'paypal', 'bitcoin')
   * @returns Payment strategy instance
   * @throws Error if payment type is not supported
   */
  getStrategy(type: string): IPaymentStrategy {
    const factory = this.strategies.get(type);
    
    if (!factory) {
      throw new Error(`Unsupported payment type: ${type}`);
    }
    
    return factory();
  }

  /**
   * Check if a payment type is supported
   * @param type Payment type to check
   * @returns true if supported, false otherwise
   */
  isSupported(type: string): boolean {
    return this.strategies.has(type);
  }

  /**
   * Get list of all supported payment types
   * @returns Array of supported payment type strings
   */
  getSupportedTypes(): string[] {
    return Array.from(this.strategies.keys());
  }
}
