import express from 'express';
import { 
  getCRMRecords, 
  createCRMRecord, 
  updateCRMRecord 
} from '../controllers/crm.js';

const router = express.Router();

router.get('/', getCRMRecords);
router.post('/', createCRMRecord);
router.put('/:id', updateCRMRecord);

export default router;
