import orderData from '../mockData/orders.json';
import emailService from './emailService.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class OrderService {
  constructor() {
    this.orderKey = 'quickmart-orders';
    this.loadOrders();
  }

  loadOrders() {
    try {
      const savedOrders = localStorage.getItem(this.orderKey);
      this.orders = savedOrders ? JSON.parse(savedOrders) : [...orderData];
    } catch (error) {
      console.error('Error loading orders:', error);
      this.orders = [...orderData];
    }
  }

  saveOrders() {
    try {
      localStorage.setItem(this.orderKey, JSON.stringify(this.orders));
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  }

  async getAll() {
    await delay(300);
    return [...this.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getById(id) {
    await delay(250);
    const order = this.orders.find(order => order.id === id);
    if (!order) {
      throw new Error('Order not found');
    }
    return { ...order };
  }

async create(orderData) {
    await delay(400);
    
    const newOrder = {
      id: `ORD-${Date.now()}`,
      ...orderData,
      createdAt: new Date().toISOString(),
      status: 'pending',
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      timeline: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          description: 'Order received and being processed'
        }
      ]
    };
    
    this.orders.unshift(newOrder);
    this.saveOrders();
    
    // Send order confirmation email
    try {
      await emailService.sendOrderConfirmation(newOrder, orderData.email || 'customer@example.com');
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      // Don't fail the order creation if email fails
    }
    
    return { ...newOrder };
  }

async updateStatus(id, status) {
    await delay(200);
    
    const orderIndex = this.orders.findIndex(order => order.id === id);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    const statusDescriptions = {
      pending: 'Order received and being processed',
      processing: 'Order is being prepared for shipment',
      shipped: 'Order has been shipped and is on the way',
      delivered: 'Order has been delivered successfully'
    };
    
    this.orders[orderIndex].status = status;
    this.orders[orderIndex].timeline.push({
      status,
      timestamp: new Date().toISOString(),
      description: statusDescriptions[status] || 'Order status updated'
    });
    
    this.saveOrders();
    
    // Send email notification for status change
    try {
      const updatedOrder = { ...this.orders[orderIndex] };
      await emailService.sendOrderStatusEmail(updatedOrder, updatedOrder.email || 'customer@example.com');
    } catch (error) {
      console.error('Failed to send status update email:', error);
      // Don't fail the status update if email fails
    }
    
    return { ...this.orders[orderIndex] };
  }

  async getRecentOrders(limit = 5) {
    await delay(200);
    return [...this.orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }

  async getOrdersByStatus(status) {
    await delay(250);
    return this.orders.filter(order => order.status === status);
  }
}

export default new OrderService();