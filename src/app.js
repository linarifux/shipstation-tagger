import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import apiRoutes from './routes/index.js';

// router imports
import orderRoutes from './routes/orderRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api', apiRoutes);
app.use('/api', orderRoutes);

// Health check
app.get('/', (req, res) => res.send('ShipStation Tagger Service is Running 🚀'));

// Start Server
app.listen(config.port, () => {
  console.log(`\n🚀 Server running on port ${config.port}`);
  console.log(`📡 Endpoint: http://localhost:${config.port}/api/sync-tags\n`);
});