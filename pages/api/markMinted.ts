import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { playerItemId } = req.body;
  if (!playerItemId) return res.status(400).end();

  await pool.query(
    `
    UPDATE player_items
    SET minted = true, minted_at = NOW()
    WHERE id = $1
    `,
    [playerItemId]
  );

  res.status(200).json({ ok: true });
}
