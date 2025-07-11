
import express from 'express';

import morgan from 'morgan';

// Routes
import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import leadRoutes from './routes/leadRoutes.js';

const app = express();

// Middleware

app.use(express.json());
app.use(morgan('dev'))


// Route Mounting
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/leads', leadRoutes);

export default app;
