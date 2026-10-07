// Shipping Strategy Interface
// Defines the contract for all shipping calculation strategies
export interface IShippingStrategy {
  /**
   * Calculate the shipping cost
   * @returns The shipping cost amount
   */
  calculateCost(): number;
  
  /**
   * Get the estimated delivery time in days
   * @returns Number of days for delivery
   */
  getDeliveryDays(): number;
  
  /**
   * Get the shipping method identifier
   * @returns The shipping method string (e.g., 'standard', 'express', 'overnight')
   */
  getMethod(): string;
}
