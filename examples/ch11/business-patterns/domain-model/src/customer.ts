/**
 * Domain Model Pattern - Customer
 * 
 * Represents a customer with business behavior
 */

export class Customer {
  constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly email: string,
    private readonly vipStatus: boolean = false
  ) {}
  
  getId(): number {
    return this.id;
  }
  
  getName(): string {
    return this.name;
  }
  
  getEmail(): string {
    return this.email;
  }
  
  isVIP(): boolean {
    return this.vipStatus;
  }
  
  /**
   * Calculates customer-specific discount percentage
   */
  getDiscountRate(): number {
    return this.vipStatus ? 0.05 : 0;
  }
}
