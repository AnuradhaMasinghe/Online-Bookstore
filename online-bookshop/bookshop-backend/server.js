const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

const fs = require("fs");

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes'); 
const orderRoutes = require('./routes/orderRoutes');
const profileRoutes = require('./routes/profileRoutes');
const invoiceRoutes = require("./routes/invoiceRoutes");
const favorites = require("./routes/favorites");
const messageRoutes = require("./routes/messageRoutes");


// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/favorites', favorites);
app.use('/api/message', messageRoutes);


app.use('/api', profileRoutes);  
const path = require("path");
app.use("/invoices", express.static(path.join(__dirname, "invoices")));

// Ensure invoices folder exists
const invoicesDir = path.join(__dirname, "invoices");
if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir);
}

// Routes
app.use("/api/invoice", invoiceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
