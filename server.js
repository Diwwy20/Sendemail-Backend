import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import morgan from 'morgan';
import connectDB from './config/db';
import { errorResponseHandler, invalidPathHandler } from './middleware/errorHandler';

// Routes
import userRoutes from './routes/userRoutes';
import emailRoutes from './routes/emailRoute';

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api/user', userRoutes);
app.use('/api/mail', emailRoutes);

// static assets
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Middlewares
app.use(invalidPathHandler);
app.use(errorResponseHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})