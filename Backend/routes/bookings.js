import express from 'express';
import { 
  getBookings, 
  createBooking, 
  updateBooking 
} from '../controllers/bookings.js';

const router = express.Router();

router.get('/', getBookings);
router.post('/', createBooking);
router.put('/:id', updateBooking);

export default router;
