import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { protect } from './middleware/Authorization/protect.js';
import userRouter from './routes/userRouter.js';
import shopRouter from './routes/shopRouter.js';
import productRouter from './routes/productRouter.js';
import saleRouter from './routes/saleEntryRouter.js';
import feedbackRouter from './routes/feedbackRouter.js';
import laborRouter from './routes/laborRouter.js';


// 1. SETUP ENVIRONMENT VARIABLES FIRST
dotenv.config();

// 2. CONNECT TO DATABASE
connectDB();

// 3. INITIALIZE EXPRESS
const app = express();

// 4. MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(morgan('dev'))

// 5. ROUTES
app.get('/', protect,(req, res) => {
    res.send('Shop SaaS API is running...');
});
app.use("/api/auth" , userRouter);
app.use("/api/shop" , shopRouter);
app.use("/api/product" , productRouter);
app.use("/api/sale" , saleRouter);
app.use("/api/feedback" , feedbackRouter);
app.use("/api/labor" , laborRouter);

// 6. START LISTENING
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});