const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CartService {
  constructor() {
    this.cartKey = 'quickmart-cart';
    this.loadCart();
  }

  loadCart() {
    try {
      const savedCart = localStorage.getItem(this.cartKey);
      this.cart = savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart:', error);
      this.cart = [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
      // Dispatch custom event for cart updates
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }

  async getCart() {
    await delay(200);
    return [...this.cart];
  }

  async addItem(productId, quantity = 1, price) {
    await delay(250);
    
    const existingItemIndex = this.cart.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      this.cart[existingItemIndex].quantity += quantity;
    } else {
      this.cart.push({
        productId,
        quantity,
        price,
        addedAt: new Date().toISOString()
      });
    }
    
    this.saveCart();
    return [...this.cart];
  }

  async updateQuantity(productId, quantity) {
    await delay(200);
    
    if (quantity <= 0) {
      return this.removeItem(productId);
    }
    
    const itemIndex = this.cart.findIndex(item => item.productId === productId);
    if (itemIndex >= 0) {
      this.cart[itemIndex].quantity = quantity;
      this.saveCart();
    }
    
    return [...this.cart];
  }

  async removeItem(productId) {
    await delay(200);
    
    this.cart = this.cart.filter(item => item.productId !== productId);
    this.saveCart();
    return [...this.cart];
  }

  async clearCart() {
    await delay(200);
    
    this.cart = [];
    this.saveCart();
    return [];
  }

  async getItemCount() {
    await delay(100);
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  async getTotal() {
    await delay(100);
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}

export default new CartService();