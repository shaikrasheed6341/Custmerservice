import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Database connection
import './db/index.js';

// Import configurations
import { config as exotelConfig, isConfigured } from './config/exotel.js';

// Import Router modules
import callsRouter from './routes/calls.js';
import bookingsRouter from './routes/bookings.js';
import ticketsRouter from './routes/tickets.js';
import crmRouter from './routes/crm.js';
import agentsRouter from './routes/agents.js';
import sosRouter from './routes/sos.js';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes registration
app.use('/api/calls', callsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/crm', crmRouter);
app.use('/api/agents', agentsRouter);
app.use('/api/sos', sosRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    exotelConfigured: isConfigured,
    exotelVirtualNumber: exotelConfig.virtualNumber || 'Not Configured',
    mode: isConfigured ? 'Live Exotel Integration' : 'Sandbox / Mock Mode'
  });
});

// Default status endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Customer Service Backend API',
    endpoints: {
      health: '/health',
      calls: '/api/calls',
      bookings: '/api/bookings',
      tickets: '/api/tickets',
      crm: '/api/crm',
      agents: '/api/agents'
    }
  });
});

// Error handling middleware
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message, err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred',
    error: err.message,
    stack: err.stack
  });
});

// Start Express Server
app.listen(port, () => {
  console.log(`\n🚀 Backend server is running on port ${port}`);
  console.log(`📡 Health endpoint: http://localhost:${port}/health`);
  console.log(`🔧 Mode: ${isConfigured ? 'LIVE (Exotel API Connected)' : 'SANDBOX (Local Call Simulation)'}\n`);
});
