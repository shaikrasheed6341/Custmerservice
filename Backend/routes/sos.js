import express from 'express';
import { 
  triggerSOS, 
  getActiveSOSCount, 
  simulateBulkSOS 
} from '../controllers/sos.js';

const router = express.Router();

router.post('/trigger', triggerSOS);
router.get('/active-count', getActiveSOSCount);
router.post('/simulate-bulk', simulateBulkSOS);

export default router;
