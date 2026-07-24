import { pgTable, serial, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';

// 1. Agents Table
export const agents = pgTable('agents', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  status: varchar('status', { length: 50 }).notNull().default('Available'), // e.g. Talking, Available, Break, Offline
  badgeColor: varchar('badge_color', { length: 100 }).notNull().default('bg-teal-100 text-teal-800 border-teal-200')
});

// 2. CRM Records Table
export const crmRecords = pgTable('crm_records', {
  id: serial('id').primaryKey(),
  crmId: varchar('crm_id', { length: 50 }).notNull().unique(), // e.g. crm-1
  name: varchar('name', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }),
  gst: varchar('gst', { length: 50 }),
  email: varchar('email', { length: 150 }),
  phone: varchar('phone', { length: 50 }).notNull(),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  preferredLanguage: varchar('preferred_language', { length: 50 }).default('English'),
  notes: text('notes'),
  previousBookingsCount: integer('previous_bookings_count').default(0),
  outstandingAmount: integer('outstanding_amount').default(0),
  mediator: varchar('mediator', { length: 100 })
});

// 3. Bookings Table
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  bookingId: varchar('booking_id', { length: 50 }).notNull().unique(), // e.g. SH-1024
  customer: varchar('customer', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  workers: integer('workers').notNull().default(1),
  status: varchar('status', { length: 50 }).notNull().default('Pending'), // Assigned, Pending
  agent: varchar('agent', { length: 100 }),
  date: varchar('date', { length: 50 }), // e.g. 2026-07-24
  time: varchar('time', { length: 50 }), // e.g. 10:00 AM
  mediator: varchar('mediator', { length: 100 }),
  workType: varchar('work_type', { length: 100 }) // Mason, Carpenter, Painter, etc.
});

// 4. Tickets Table
export const tickets = pgTable('tickets', {
  id: serial('id').primaryKey(),
  ticketId: varchar('ticket_id', { length: 50 }).notNull().unique(), // e.g. SH-2026-00231
  customer: varchar('customer', { length: 255 }).notNull(),
  complaint: varchar('complaint', { length: 255 }).notNull(),
  priority: varchar('priority', { length: 50 }).notNull().default('Medium'), // High, Medium, Low
  description: text('description'),
  agent: varchar('agent', { length: 100 }),
  status: varchar('status', { length: 50 }).notNull().default('Open'), // In Progress, Open, Closed
  date: varchar('date', { length: 50 }) // e.g. 2026-07-23
});

// 5. Call History Logs Table
export const callHistory = pgTable('call_history', {
  id: serial('id').primaryKey(),
  sid: varchar('sid', { length: 100 }).notNull().unique(), // Exotel Call Sid
  date: varchar('date', { length: 50 }).notNull(), // e.g. 10:20 AM
  customer: varchar('customer', { length: 255 }),
  customerNumber: varchar('customer_number', { length: 50 }),
  agent: varchar('agent', { length: 100 }),
  agentNumber: varchar('agent_number', { length: 50 }),
  duration: varchar('duration', { length: 50 }).default('00:00'), // e.g. 04:15
  status: varchar('status', { length: 50 }).default('completed'), // completed, failed, busy, etc.
  recordingUrl: text('recording_url'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  callType: varchar('call_type', { length: 50 }).default('regular') // 'regular', 'sos'
});
