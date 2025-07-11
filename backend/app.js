
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// Routes
import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import leadRoutes from './routes/leadRoutes.js';

const app = express();

// Middleware
app.use(cors([
  {
    "origin": ["http://localhost:5173"],
    "method": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Authorization"]
  }
]));
app.use(express.json());
app.use(morgan('dev'))


// Route Mounting
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/leads', leadRoutes);

export default app;
