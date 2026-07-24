import express from 'express';
import { 
  getAgents, 
  updateAgentStatus 
} from '../controllers/agents.js';

const router = express.Router();

router.get('/', getAgents);
router.put('/:name/status', updateAgentStatus);

export default router;
