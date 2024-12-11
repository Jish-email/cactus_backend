import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import profileRoutes from './routes/profile.routes.js';

dotenv.config();

const app = express();


app.use(cors({
  origin: 'https://jade-bunny-3b6c31.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Adjust methods as needed
  credentials: true // Optional if you need credentials like cookies
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/users', userRoutes);
app.use('/profile', profileRoutes);
app.use('/post', postRoutes);




export default app;
