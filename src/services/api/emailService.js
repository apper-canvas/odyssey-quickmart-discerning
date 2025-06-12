import nodemailer from 'nodemailer';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock email transporter for development
const createTransporter = () => {
  // In production, configure with real SMTP settings
  return nodemailer.createTransporter({
    host: 'smtp.ethereal.email', // Mock SMTP for development
    port: 587,
    secure: false,
    auth: {
      user: 'test@example.com',
      pass: 'testpassword'
    }
  });
};

class EmailService {
  constructor() {
    this.transporter = createTransporter();
  }

  async sendOrderStatusEmail(order, customerEmail) {
    await delay(300); // Simulate email sending delay
    
    const statusTemplates = {
      pending: {
        subject: `Order Confirmation - ${order.id}`,
        body: `
          <h2>Thank you for your order!</h2>
          <p>Your order ${order.id} has been received and is being processed.</p>
          <p><strong>Order Total:</strong> $${order.total}</p>
          <p><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleDateString()}</p>
          <p>We'll keep you updated on your order status.</p>
        `
      },
      processing: {
        subject: `Order Processing - ${order.id}`,
        body: `
          <h2>Your order is being prepared!</h2>
          <p>Great news! Your order ${order.id} is now being processed and prepared for shipment.</p>
          <p><strong>Order Total:</strong> $${order.total}</p>
          <p><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleDateString()}</p>
          <p>You'll receive another update when your order ships.</p>
        `
      },
      shipped: {
        subject: `Order Shipped - ${order.id}`,
        body: `
          <h2>Your order is on the way!</h2>
          <p>Exciting news! Your order ${order.id} has been shipped and is on its way to you.</p>
          <p><strong>Order Total:</strong> $${order.total}</p>
          <p><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleDateString()}</p>
          <p>Track your package and stay updated on delivery progress.</p>
        `
      },
      delivered: {
        subject: `Order Delivered - ${order.id}`,
        body: `
          <h2>Your order has been delivered!</h2>
          <p>Wonderful! Your order ${order.id} has been successfully delivered.</p>
          <p><strong>Order Total:</strong> $${order.total}</p>
          <p>We hope you enjoy your purchase! Thank you for shopping with us.</p>
          <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
        `
      }
    };

    const template = statusTemplates[order.status];
    if (!template) {
      throw new Error(`No email template found for status: ${order.status}`);
    }

    const mailOptions = {
      from: '"QuickMart" <noreply@quickmart.com>',
      to: customerEmail,
      subject: template.subject,
      html: template.body
    };

    try {
      // In development, just log the email instead of actually sending
      console.log('📧 Email Notification Sent:', {
        to: customerEmail,
        subject: template.subject,
        orderId: order.id,
        status: order.status
      });
      
      // Uncomment for production with real SMTP
      // await this.transporter.sendMail(mailOptions);
      
      return { success: true, message: 'Email notification sent successfully' };
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send email notification');
    }
  }

  async sendOrderConfirmation(order, customerEmail) {
    return this.sendOrderStatusEmail({ ...order, status: 'pending' }, customerEmail);
  }
}

export default new EmailService();