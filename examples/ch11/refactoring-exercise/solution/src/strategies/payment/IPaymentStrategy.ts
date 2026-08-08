// Payment Strategy Interface
// Defines the contract for all payment processing strategies
export interface IPaymentStrategy {
  /**
   * Calculate the payment processing fee for a given subtotal
   * @param subtotal The order subtotal amount
   * @returns The payment fee amount
   */
  calculateFee(subtotal: number): number;
  
  /**
   * Get the payment type identifier
   * @returns The payment type string (e.g., 'credit_card', 'paypal', 'bitcoin')
   */
  getType(): string;
}
