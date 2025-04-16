const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },

        description: { type: String },

        price: { type: Number, required: true },
        
        category: { type: String },

        images: [{
            fieldname:{type:String},

            originalname: { type: String },
            
            filename : { type: String },

            destination:{type:String},

            path: { type: String },

            createdAt: { type: Date, default: Date.now }

        }], 
        
        stock: { type: Number, default: 0 },

        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }, 
{ timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
