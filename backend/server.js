// backend/server.js
import app from './app.js';
import {connectDB} from './db/connectMongo.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const allowedOrigins = [
  'http://localhost:5173',
  'https://trust-well-developers.vercel.app',
  'https://www.trust-well-developers.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

const PORT = process.env.PORT || 5000;

connectDB()

app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });