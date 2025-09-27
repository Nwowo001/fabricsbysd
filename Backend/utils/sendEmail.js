import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const message = {
    from: `FabricsBySD <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html
  };

  await transporter.sendMail(message);
};

export const sendOrderConfirmation = async (order, user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7c3aed;">Order Confirmation - ${order.orderNumber}</h2>
      <p>Dear ${user.name},</p>
      <p>Thank you for your order! We've received your order and will process it shortly.</p>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Order Details:</h3>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Total Amount:</strong> ₦${order.totalPrice.toLocaleString()}</p>
        <p><strong>Status:</strong> ${order.status}</p>
      </div>

      <h3>Items Ordered:</h3>
      ${order.items.map(item => `
        <div style="border-bottom: 1px solid #e5e7eb; padding: 10px 0;">
          <p><strong>${item.name}</strong></p>
          <p>Quantity: ${item.quantity} | Price: ₦${item.price.toLocaleString()}</p>
          ${item.size ? `<p>Size: ${item.size}</p>` : ''}
          ${item.color ? `<p>Color: ${item.color}</p>` : ''}
        </div>
      `).join('')}

      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Shipping Address:</h3>
        <p>${order.shippingAddress.fullName}</p>
        <p>${order.shippingAddress.address}</p>
        <p>${order.shippingAddress.city}, ${order.shippingAddress.state}</p>
        <p>${order.shippingAddress.country}</p>
        <p>Phone: ${order.shippingAddress.phone}</p>
      </div>

      <p>We'll send you another email when your order ships.</p>
      <p>Thank you for shopping with FabricsBySD!</p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html
  });
};

export const sendQuoteReady = async (order, user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7c3aed;">Quote Ready - ${order.orderNumber}</h2>
      <p>Dear ${user.name},</p>
      <p>Great news! We've reviewed your order and prepared a quote for you.</p>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Quote Details:</h3>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Items Total:</strong> ₦${order.itemsPrice.toLocaleString()}</p>
        <p><strong>Delivery Fee:</strong> ₦${order.deliveryFee.toLocaleString()}</p>
        <p><strong>Final Total:</strong> ₦${order.totalPrice.toLocaleString()}</p>
        ${order.adminNotes ? `<p><strong>Note:</strong> ${order.adminNotes}</p>` : ''}
      </div>

      <p><strong>Next Steps:</strong></p>
      <p>1. Login to your account to review the quote</p>
      <p>2. Accept the quote and complete payment</p>
      <p>3. We'll process and ship your order</p>

      <p>Thank you for choosing FabricsBySD!</p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: `Quote Ready - ${order.orderNumber}`,
    html
  });
};

export const sendOrderStatusUpdate = async (order, user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7c3aed;">Order Status Update - ${order.orderNumber}</h2>
      <p>Dear ${user.name},</p>
      <p>Your order status has been updated.</p>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>New Status:</strong> ${order.status.toUpperCase()}</p>
        ${order.status === 'shipped' ? '<p>Your order is on its way!</p>' : ''}
        ${order.status === 'delivered' ? '<p>Your order has been delivered. Thank you for shopping with us!</p>' : ''}
      </div>

      <p>Thank you for choosing FabricsBySD!</p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: `Order Status Update - ${order.orderNumber}`,
    html
  });
};

export default sendEmail;