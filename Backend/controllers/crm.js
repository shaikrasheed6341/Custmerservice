import { db } from '../db/index.js';
import { crmRecords } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

/**
 * Fetch all CRM records
 */
export const getCRMRecords = async (req, res) => {
  try {
    const list = await db.select().from(crmRecords).orderBy(desc(crmRecords.id));
    return res.status(200).json({ success: true, data: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch CRM records', error: error.message });
  }
};

/**
 * Create a new CRM record
 */
export const createCRMRecord = async (req, res) => {
  const { name, company, gst, email, phone, address, city, state, preferredLanguage, notes, mediator } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ success: false, message: 'Name and Phone are required' });
  }

  const crmId = `crm-${Math.floor(100 + Math.random() * 900)}`;

  try {
    const newRecord = {
      crmId,
      name,
      company: company || '',
      gst: gst || '',
      email: email || '',
      phone,
      address: address || '',
      city: city || '',
      state: state || '',
      preferredLanguage: preferredLanguage || 'English',
      notes: notes || '',
      previousBookingsCount: 0,
      outstandingAmount: 0,
      mediator: mediator || ''
    };

    await db.insert(crmRecords).values(newRecord);
    const [created] = await db.select().from(crmRecords).where(eq(crmRecords.crmId, crmId));

    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create CRM record', error: error.message });
  }
};

/**
 * Update a CRM record
 */
export const updateCRMRecord = async (req, res) => {
  const { id } = req.params;
  const { name, company, gst, email, phone, address, city, state, preferredLanguage, notes, outstandingAmount, mediator } = req.body;

  try {
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (company !== undefined) updates.company = company;
    if (gst !== undefined) updates.gst = gst;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (address !== undefined) updates.address = address;
    if (city !== undefined) updates.city = city;
    if (state !== undefined) updates.state = state;
    if (preferredLanguage !== undefined) updates.preferredLanguage = preferredLanguage;
    if (notes !== undefined) updates.notes = notes;
    if (outstandingAmount !== undefined) updates.outstandingAmount = parseInt(outstandingAmount, 10);
    if (mediator !== undefined) updates.mediator = mediator;

    await db.update(crmRecords).set(updates).where(eq(crmRecords.crmId, id));
    const [updated] = await db.select().from(crmRecords).where(eq(crmRecords.crmId, id));

    if (!updated) {
      return res.status(404).json({ success: false, message: 'CRM Record not found' });
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update CRM record', error: error.message });
  }
};
