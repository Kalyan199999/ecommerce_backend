const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const productRoute = require('./routes/products')
const userRoute = require('./routes/user')
const orderRoute = require('./routes/orders')

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', userRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
    try {
        console.log(`Server running on port ${PORT}`)
        // Connect Database
        connectDB();
    } catch (error) {
        console.log("error");
    }
});