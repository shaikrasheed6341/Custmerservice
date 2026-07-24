import { db } from '../db/index.js';
import { bookings } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

/**
 * Fetch all bookings
 */
export const getBookings = async (req, res) => {
  try {
    const list = await db.select().from(bookings).orderBy(desc(bookings.id));
    return res.status(200).json({ success: true, data: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch bookings', error: error.message });
  }
};

/**
 * Create a new booking
 */
export const createBooking = async (req, res) => {
  const { customer, location, workers, date, time, workType } = req.body;

  if (!customer || !location) {
    return res.status(400).json({ success: false, message: 'Customer and Location are required' });
  }

  const bookingId = `SH-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    const newBookingData = {
      bookingId,
      customer,
      location,
      workers: workers ? parseInt(workers, 10) : 1,
      status: 'Pending',
      date: date || new Date().toISOString().split('T')[0],
      time: time || '12:00 PM',
      mediator: '',
      agent: '',
      workType: workType || 'General'
    };

    await db.insert(bookings).values(newBookingData);
    const [created] = await db.select().from(bookings).where(eq(bookings.bookingId, bookingId));

    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create booking', error: error.message });
  }
};

/**
 * Update a booking (assign agent/mediator, change status)
 */
export const updateBooking = async (req, res) => {
  const { id } = req.params;
  const { status, agent, mediator, workers, location, time, date } = req.body;

  try {
    const updates = {};
    if (status !== undefined) updates.status = status;
    if (agent !== undefined) updates.agent = agent;
    if (mediator !== undefined) updates.mediator = mediator;
    if (workers !== undefined) updates.workers = parseInt(workers, 10);
    if (location !== undefined) updates.location = location;
    if (time !== undefined) updates.time = time;
    if (date !== undefined) updates.date = date;

    await db.update(bookings).set(updates).where(eq(bookings.bookingId, id));
    const [updated] = await db.select().from(bookings).where(eq(bookings.bookingId, id));

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update booking', error: error.message });
  }
};
