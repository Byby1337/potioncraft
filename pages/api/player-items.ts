import type { NextApiRequest, NextApiResponse } from 'next';
import Pool  from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const wallet = req.query.wallet as string;

  if (!wallet) return res.status(400).json({ error: 'wallet query required' });

  try {
    const result = await Pool.query(
      `SELECT pi.id, pi.activated,gi.can_be_nft, gi.name, gi.image_url, gi.rarity
       FROM player_items pi
       JOIN game_items gi ON gi.id = pi.item_id
       JOIN players p ON pi.player_id = p.id
       WHERE LOWER(p.wallet) = LOWER($1)`,
      [wallet]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}