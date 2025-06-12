import productData from '../mockData/products.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProductService {
  constructor() {
    this.data = [...productData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(250);
    const product = this.data.find(item => item.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    return { ...product };
  }

  async getByCategory(category) {
    await delay(300);
    return this.data.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    ).map(product => ({ ...product }));
  }

  async search(query) {
    await delay(200);
    const searchTerm = query.toLowerCase();
    return this.data.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    ).map(product => ({ ...product }));
  }

  async getCategories() {
    await delay(200);
    const categories = [...new Set(this.data.map(product => product.category))];
    return categories;
  }

  async getFeatured() {
    await delay(250);
    return this.data.filter(product => product.featured).map(product => ({ ...product }));
  }

  async updateStock(id, quantity) {
    await delay(200);
    const productIndex = this.data.findIndex(product => product.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    
    this.data[productIndex].stock -= quantity;
    return { ...this.data[productIndex] };
  }
}

export default new ProductService();