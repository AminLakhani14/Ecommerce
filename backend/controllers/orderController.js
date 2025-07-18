import Order from '../models/orderModel.js';

// @desc    Create new order
const addOrderItems = async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    if (orderItems && orderItems.length === 0) {
        res.status(400).send('No order items');
        return;
    } else {
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
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
};

// @desc    Get order by ID
const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
        res.json(order);
    } else {
        res.status(404).send('Order not found');
    }
};

export { addOrderItems, getOrderById };