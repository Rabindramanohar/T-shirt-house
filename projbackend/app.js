require('dotenv').config();

const mongoose = require("mongoose");
const express = require("express");
const port = process.env.PORT || 8000;
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// My routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');


// DB connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("DB CONNECTED!!");
}).catch("DB NOT CONNECTED!!");


// MIDDLEWARES 
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*")
//   })

// My Routes
app.use("/api", authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);

// Starting the server
app.listen(port, () => console.log(`app connected on ${port}`));