const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price:{
          type: Number,
          required: true,
          min: 100,
        },
        adminId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User', // admins are in the User model
          required: true,
        }
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    
    shippingAddress: { type: String},
    
    paymentMethod: {
      type: String,
      enum: ['Cash on Delivery', 'Online Payment'],
      default: 'Cash on Delivery',
    },
    
    orderData:{
      type: Date,
      default: Date.now,
    },
    
    paymentStatus: { type: String, default: 'Unpaid' }, // Paid, Unpaid


  },
  { timestamps: true }
);

module.exports =  mongoose.model('Order', orderSchema);


