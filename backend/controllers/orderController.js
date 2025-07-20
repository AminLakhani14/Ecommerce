import Order from '../models/orderModel.js';
import sendEmail from '../utils/sendEmail.js'; // <-- THIS IS THE MISSING LINE
import Product from '../models/productModel.js'; // <-- IMPORT PRODUCT MODEL
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice, email } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      orderItems: orderItems.map(x => ({ ...x, product: x._id, _id: undefined })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.countInStock -= item.qty;
          await product.save();
        }
      }

    if (paymentMethod === 'Cash on Delivery') {
        order.isPaid = true;
        order.paidAt = Date.now();
      }

    const createdOrder = await order.save();
    
    // --- SEND EMAIL LOGIC ---
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
        <h1 style="color: #1a1a1a; text-align: center;">Thank You For Your Order!</h1>
        <p>Hi ${shippingAddress.firstName},</p>
        <p>We've received your order and are getting it ready for shipment. You can view your order details below.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #1a1a1a;">Order #${createdOrder._id}</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ddd;">Product</th>
                <th style="text-align: right; padding: 8px; border-bottom: 2px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${createdOrder.orderItems.map(item => `
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">
                    ${item.name} <span style="color: #666;">(x${item.qty})</span>
                  </td>
                  <td style="text-align: right; padding: 8px; border-bottom: 1px solid #eee;">PKR ${item.price * item.qty}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td style="text-align: right; padding: 8px;">Subtotal:</td>
                <td style="text-align: right; padding: 8px;">PKR ${createdOrder.itemsPrice}</td>
              </tr>
              <tr>
                <td style="text-align: right; padding: 8px;">Shipping:</td>
                <td style="text-align: right; padding: 8px;">PKR ${createdOrder.shippingPrice}</td>
              </tr>
              <tr>
                <td style="text-align: right; padding: 8px;">Tax:</td>
                <td style="text-align: right; padding: 8px;">PKR ${createdOrder.taxPrice}</td>
              </tr>
              <tr style="font-weight: bold; font-size: 1.1em;">
                <td style="text-align: right; padding: 8px;">Total:</td>
                <td style="text-align: right; padding: 8px;">PKR ${createdOrder.totalPrice}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div style="display: flex; justify-content: space-between;">
            <div style="width: 48%;">
                <h3 style="color: #1a1a1a;">Shipping To:</h3>
                <p>
                    ${shippingAddress.firstName} ${shippingAddress.lastName}<br>
                    ${shippingAddress.address}<br>
                    ${shippingAddress.city}, ${shippingAddress.state}<br>
                    ${shippingAddress.postalCode}, ${shippingAddress.country}
                </p>
            </div>
            <div style="width: 48%;">
                <h3 style="color: #1a1a1a;">Payment Method:</h3>
                <p>${createdOrder.paymentMethod}</p>
            </div>
        </div>

        <p style="text-align: center; margin-top: 30px; color: #888;">Thank you for shopping at AG-Store!</p>
      </div>
    `;

    await sendEmail({
      email: shippingAddress.email,
      subject: `Your AG-Store Order Confirmation #${createdOrder._id}`,
      html: emailHtml,
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Update order to paid (Simulated)
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
  
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.params.id,
                status: 'COMPLETED',
                update_time: new Date().toISOString(),
                email_address: req.user.email,
            };
      
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error updating order to paid:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// This is a conceptual function for a future feature
const cancelOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order && !order.isDelivered) { // Only non-delivered orders can be cancelled
        // --- START: RESTOCK LOGIC ---
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                product.countInStock += item.qty;
                await product.save();
            }
        }
        // --- END: RESTOCK LOGIC ---

        order.isCancelled = true; // You would add an 'isCancelled' field to the model
        await order.save();
        res.json({ message: 'Order cancelled and items restocked.' });
    } else {
        res.status(404).json({ message: 'Order not found or cannot be cancelled.' });
    }
};

export { addOrderItems, getOrderById, updateOrderToPaid, cancelOrder };