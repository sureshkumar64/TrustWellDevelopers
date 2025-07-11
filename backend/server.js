// backend/server.js
import app from './app.js';
import {connectDB} from './db/connectMongo.js';
import dotenv from 'dotenv';

dotenv.config();


const PORT = process.env.PORT || 5000;

connectDB()

app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });