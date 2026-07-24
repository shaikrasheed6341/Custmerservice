import { db } from '../db/index.js';
import { agents } from '../db/schema.js';
import { eq } from 'drizzle-orm';

/**
 * Fetch all agents
 */
export const getAgents = async (req, res) => {
  try {
    const list = await db.select().from(agents);
    return res.status(200).json({ success: true, data: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch agents', error: error.message });
  }
};

/**
 * Update agent status
 */
export const updateAgentStatus = async (req, res) => {
  const { name } = req.params;
  const { status, badgeColor } = req.body;

  try {
    const updates = {};
    if (status !== undefined) updates.status = status;
    if (badgeColor !== undefined) updates.badgeColor = badgeColor;

    await db.update(agents).set(updates).where(eq(agents.name, name));
    const [updated] = await db.select().from(agents).where(eq(agents.name, name));

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Agent not found' });
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update agent status', error: error.message });
  }
};
