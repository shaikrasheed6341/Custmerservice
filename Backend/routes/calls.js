import express from 'express';
import { 
  connectCall, 
  getCallHistory, 
  getActiveCalls, 
  getCallDetails, 
  connectCustomerWebhook, 
  incomingCallWebhook, 
  statusWebhook 
} from '../controllers/calls.js';

const router = express.Router();

// REST endpoints for calls management
router.post('/connect', connectCall);
router.get('/history', getCallHistory);
router.get('/active', getActiveCalls);
router.get('/:sid', getCallDetails);

// Webhook endpoints for Exotel integration
router.all('/webhooks/connect-customer', connectCustomerWebhook);
router.all('/webhooks/incoming', incomingCallWebhook);
router.post('/webhooks/status', statusWebhook);

export default router;
