// backend/server.js
import app from './app.js';
import {connectDB} from './db/connectMongo.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
app.use(cors([
  {
    "origin": ["http://localhost:5173","https://trust-well-developers.vercel.app"],
    "method": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Authorization"]
  }
]));
const PORT = process.env.PORT || 5000;

connectDB()

app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });