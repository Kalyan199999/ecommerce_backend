const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const createOrder = async (req, res) => {
  try {
    const { userId, shippingAddress, totalAmount, products, paymentMethod } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const allOrderedProducts = await Promise.all(
      products.map(async (eachProduct) => {

        const product = await Product.findById(eachProduct.productId);
        const admin = await User.findById(eachProduct.adminId);

        if (!product || !admin) throw new Error("Invalid product or admin");

        return {
          productId: product._id,
          quantity: eachProduct.quantity,
          price: eachProduct.price,
          adminId: admin._id,
        };
      })
    );

    const order = new Order({
      userId: user._id, 
      products: allOrderedProducts,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    const savedOrder = await order.save();
    res.status(201).json({ message: 'Order created successfully', order: savedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
};



const getUserOrders = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });

    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        const populatedProducts = await Promise.all(
          order.products.map(async (eachProduct) => {
            const product = await Product.findById(eachProduct.productId);

            return {
              title: product.title,
              category: product.category,
              price: product.price,
              quantity: eachProduct.quantity,
            };
          })
        );

        return {
          ...order._doc,
          products: populatedProducts, 
        };
      })
    );

    res.json(populatedOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};


const getAdminOrders = async (req, res) => {
  try {
    const adminId = req.params.adminId;

    const orders = await Order.find({ 'products.adminId': adminId });

    const filteredOrders = await Promise.all(
      orders.map(async (order) => {
        const adminProducts = await Promise.all(
          order.products
            .filter(p => p.adminId.toString() === adminId)
            .map(async (p) => {
              const product = await Product.findById(p.productId);

              return {
                title: product?.title || 'Unknown',
                category: product?.category || 'Unknown',
                quantity: p.quantity,
                price: p.price,
              };
            })
        );

        return {
          _id: order._id,
          userId: order.userId,
          totalAmount: order.totalAmount,
          shippingAddress: order.shippingAddress,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          status: order.status,
          createdAt: order.createdAt,
          products: adminProducts,
        };
      })
    );

    res.status(200).json({ message: 'Success', orders: filteredOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch admin orders' });
  }
};




module.exports = { 
    createOrder, 
    getUserOrders, 
    getAdminOrders 
};