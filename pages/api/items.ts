import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const wallet = req.query.wallet as string;

  if (!wallet) return res.status(400).json({ error: 'Wallet required' });

  const { rows } = await pool.query(`
    SELECT 
      pi.id,
      gi.name,
      gi.description,
      gi.rarity,
      gi.image_url,
      pi.minted
    FROM players_items pi
    JOIN players p ON p.id = pi.player_id
    JOIN game_items gi ON gi.id = pi.item_id
    WHERE p.wallet = $1 AND pi.burned = false
  `, [wallet.toLowerCase()]);

  res.json(rows);
}
