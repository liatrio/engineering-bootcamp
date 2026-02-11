/**
 * Domain Model Pattern - Product
 * 
 * Represents a product with business behavior
 */

export class Product {
  constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly price: number,
    private readonly category: string
  ) {
    if (price < 0) {
      throw new Error('Price cannot be negative');
    }
  }
  
  getId(): number {
    return this.id;
  }
  
  getName(): string {
    return this.name;
  }
  
  getPrice(): number {
    return this.price;
  }
  
  getCategory(): string {
    return this.category;
  }
}
