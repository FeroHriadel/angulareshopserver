const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemModel');



exports.createOrder = async (req, res) => {
    try {
        const orderItemsIds = Promise.all(req.body.orderItems.map(async item => {
            let newOrderItem = new OrderItem({
                quantity: item.quantity,
                product: item.product
            })

            newOrderItem = await newOrderItem.save();
            return newOrderItem._id;
        }));

        const orderItemsIdsResolved = await orderItemsIds;

        const totalPrices = await Promise.all(orderItemsIdsResolved.map(async orderItemId => {
            const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price')
            const totalPrice = orderItem.product.price * orderItem.quantity
            return totalPrice
        }))

        const totalPrice = totalPrices.reduce((acc, curr) => acc + curr, 0);

        let order = new Order({
            orderItems: orderItemsIdsResolved,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: totalPrice,
            user: req.user._id,
        });

        order = await order.save();
        if (!order) return res.status(500).json({error: 'Order placement failed'});

        res.status(201).json({order})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server error'});
    }
}



exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name').sort({'dateOrdered': -1})
        if (!orders) return res.status(404).json({error: 'No orders found'});

        res.json({orders});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server error'});
    }
}



exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate('user', 'name')
            .populate({
                path: 'orderItems', populate: {
                    path: 'product', populate: 'category'}});

        if (!order) return res.status(404).json({error: 'order not found'});

        res.json({order});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server error'});
    }
}



exports.updateOrder = async (req, res) => {
    try {
        if (!req.body.status) return res.status(400).json({error: 'Status is required'});

        let order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({error: 'Order not found'});

        order = await Order.findByIdAndUpdate(req.params.orderId, {status: req.body.status}, {new: true});
        if (!order) return res.status(500).json({error: 'Order update failed'});

        res.json({order});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server error'});
    }
}



exports.deleteOrder = async (req, res) => {
    try {
        Order.findByIdAndRemove(req.params.orderId)
            .then(async order => {
                if (order) {
                    await order.orderItems.map(async orderItem => {
                        await OrderItem.findByIdAndRemove(orderItem)
                    })
                    return res.json({message: 'Order deleted'});
                }
                else return res.status(404).json({error: 'Order not found'});
            })
            .catch(err => {
                return res.status(500).json({error: 'Order deletion failed'});
            });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server error'});
    }
}



exports.getUsersOrders = async (req, res) => {
    try {
        const orders = await Order.find({user: req.params.userId})
            .populate({path: 'orderItems', populate: {path: 'product', populate: 'category'}})
            .sort({'dateOrdered': -1});
        if (!orders) return res.status(404).json({error: 'No orders found'});

        res.json({orders});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Server error'});
    }
}