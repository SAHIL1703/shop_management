import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRouter from './routes/userRouter.js';
import { protect } from './middleware/Authorization/protect.js';

// 1. SETUP ENVIRONMENT VARIABLES FIRST
dotenv.config();

// 2. CONNECT TO DATABASE
connectDB();

// 3. INITIALIZE EXPRESS
const app = express();

// 4. MIDDLEWARE
app.use(cors());
app.use(express.json());

// 5. ROUTES
app.get('/', protect,(req, res) => {
    res.send('Shop SaaS API is running...');
});
app.use("/api/auth" , userRouter)

// 6. START LISTENING
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});