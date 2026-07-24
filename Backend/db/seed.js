import { db } from './index.js';
import * as schema from './schema.js';

async function seed() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // 1. Clear existing records in correct dependency order (if foreign keys existed, but they are flat right now)
    await db.delete(schema.agents);
    await db.delete(schema.crmRecords);
    await db.delete(schema.bookings);
    await db.delete(schema.tickets);
    await db.delete(schema.callHistory);
    
    console.log('🧹 Cleared all existing table data');

    // 2. Insert Agents
    console.log('👥 Seeding Agents...');
    await db.insert(schema.agents).values([
      { name: 'Rahul', status: 'Talking', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
      { name: 'Anjali', status: 'Available', badgeColor: 'bg-teal-100 text-teal-800 border-teal-200' },
      { name: 'Ravi', status: 'Break', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200' },
      { name: 'Sai', status: 'Offline', badgeColor: 'bg-slate-100 text-slate-800 border-slate-200' },
      { name: 'Priya', status: 'Available', badgeColor: 'bg-teal-100 text-teal-800 border-teal-200' }
    ]);

    // 3. Insert CRM Records
    console.log('📂 Seeding CRM Records...');
    await db.insert(schema.crmRecords).values([
      {
        crmId: 'crm-1',
        name: 'ABC Builders',
        company: 'ABC Builders Pvt Ltd',
        gst: '36AAAAA1111A1Z1',
        email: 'info@abcbuilders.com',
        phone: '+91 98765 43210',
        address: 'Plot 45, IT Park',
        city: 'Hyderabad',
        state: 'Telangana',
        preferredLanguage: 'English',
        notes: 'Prefers Ramesh as mediator. Always prompt on payments.',
        previousBookingsCount: 18,
        outstandingAmount: 12500,
        mediator: 'Ramesh'
      },
      {
        crmId: 'crm-2',
        name: 'XYZ Infra',
        company: 'XYZ Infrastructure',
        gst: '36BBBBB2222B1Z2',
        email: 'contact@xyzinfra.in',
        phone: '+91 87654 32109',
        address: 'Survey 12, Hitech City',
        city: 'Hyderabad',
        state: 'Telangana',
        preferredLanguage: 'Telugu',
        notes: 'Requires Telugu speaking workers.',
        previousBookingsCount: 8,
        outstandingAmount: 0,
        mediator: 'Ravi'
      }
    ]);

    // 4. Insert Bookings
    console.log('📅 Seeding Bookings...');
    await db.insert(schema.bookings).values([
      {
        bookingId: 'SH-1024',
        customer: 'ABC Builders',
        location: 'Gachibowli',
        workers: 25,
        status: 'Assigned',
        agent: 'Rahul',
        date: '2026-07-24',
        time: '10:00 AM',
        mediator: 'Ramesh',
        workType: 'Mason'
      },
      {
        bookingId: 'SH-1025',
        customer: 'XYZ Infra',
        location: 'Madhapur',
        workers: 10,
        status: 'Pending',
        agent: 'Priya',
        date: '2026-07-24',
        time: '11:30 AM',
        mediator: '',
        workType: 'Carpenter'
      }
    ]);

    // 5. Insert Tickets
    console.log('🎫 Seeding Tickets...');
    await db.insert(schema.tickets).values([
      {
        ticketId: 'SH-2026-00231',
        customer: 'ABC Builders',
        complaint: 'Delay in worker arrival',
        priority: 'High',
        description: 'Customer reported that the painters assigned did not arrive on time.',
        agent: 'Rahul',
        status: 'In Progress',
        date: '2026-07-23'
      },
      {
        ticketId: 'SH-2026-00232',
        customer: 'XYZ Infra',
        complaint: 'Incorrect billing',
        priority: 'Medium',
        description: 'Discrepancy in invoice amount for Madhapur project.',
        agent: 'Priya',
        status: 'Open',
        date: '2026-07-23'
      }
    ]);

    // 6. Insert Call History
    console.log('📞 Seeding Call History...');
    await db.insert(schema.callHistory).values([
      {
        sid: 'mock_sid_1',
        date: '10:20 AM',
        customer: 'ABC Builders',
        customerNumber: '+919876543210',
        agent: 'Rahul',
        agentNumber: '+919999999991',
        duration: '04:15',
        status: 'completed',
        recordingUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
      },
      {
        sid: 'mock_sid_2',
        date: '11:35 AM',
        customer: 'XYZ Infra',
        customerNumber: '+918765432109',
        agent: 'Priya',
        agentNumber: '+919999999992',
        duration: '02:45',
        status: 'completed',
        recordingUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
      },
      {
        sid: 'mock_sid_3',
        date: '01:15 PM',
        customer: 'Home Owner',
        customerNumber: '+919555512345',
        agent: 'Sai',
        agentNumber: '+919999999993',
        duration: '05:21',
        status: 'completed',
        recordingUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
      }
    ]);

    console.log('🎉 Database seeding complete!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
  } finally {
    process.exit(0);
  }
}

seed();
