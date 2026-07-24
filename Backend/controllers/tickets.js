import { db } from '../db/index.js';
import { tickets } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

/**
 * Fetch all tickets
 */
export const getTickets = async (req, res) => {
  try {
    const list = await db.select().from(tickets).orderBy(desc(tickets.id));
    return res.status(200).json({ success: true, data: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch tickets', error: error.message });
  }
};

/**
 * Create a new ticket
 */
export const createTicket = async (req, res) => {
  const { customer, complaint, priority, description, agent } = req.body;

  if (!customer || !complaint) {
    return res.status(400).json({ success: false, message: 'Customer and Complaint are required' });
  }

  const ticketId = `SH-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

  try {
    const newTicketData = {
      ticketId,
      customer,
      complaint,
      priority: priority || 'Medium',
      description: description || '',
      agent: agent || '',
      status: 'Open',
      date: new Date().toISOString().split('T')[0]
    };

    await db.insert(tickets).values(newTicketData);
    const [created] = await db.select().from(tickets).where(eq(tickets.ticketId, ticketId));

    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create ticket', error: error.message });
  }
};

/**
 * Update a ticket (assign agent, change status, etc.)
 */
export const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { status, agent, priority, description } = req.body;

  try {
    const updates = {};
    if (status !== undefined) updates.status = status;
    if (agent !== undefined) updates.agent = agent;
    if (priority !== undefined) updates.priority = priority;
    if (description !== undefined) updates.description = description;

    await db.update(tickets).set(updates).where(eq(tickets.ticketId, id));
    const [updated] = await db.select().from(tickets).where(eq(tickets.ticketId, id));

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update ticket', error: error.message });
  }
};
