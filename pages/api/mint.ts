import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../lib/db';
import axios from 'axios';
import { uploadFileToIPFS, uploadJSONToIPFS } from '../../lib/ipfs';
import { ethers } from 'ethers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { wallet, playerItemId } = req.body;

  if (!wallet || !playerItemId) {
    return res.status(400).json({ error: 'Missing params' });
  }

  const client = await pool.connect();

  try {
    const { rows } = await client.query(
      `
      SELECT 
        pi.id,
        pi.minted,
        gi.name,
        gi.description,
        gi.image_url,
        gi.rarity,
        gi.type
      FROM player_items pi
      JOIN players p ON p.id = pi.player_id
      JOIN game_items gi ON gi.id = pi.item_id
      WHERE p.wallet = $1 AND pi.id = $2
      `,
      [wallet.toLowerCase(), playerItemId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const item = rows[0];

    if (item.minted) {
      return res.status(400).json({ error: 'Item already minted' });
    }

    // 1️⃣ Загружаем изображение
    const BASE_URL = process.env.BASE_URL!;
    const imageResponse = await axios.get(
      `${BASE_URL}${item.image_url}`,
      { responseType: 'arraybuffer' }
    );

    const imageIPFS = await uploadFileToIPFS(
      Buffer.from(imageResponse.data),
      `item_${playerItemId}.png`
    );

    // 2️⃣ metadata
    const metadata = {
      name: `${item.name} #${playerItemId}`,
      description: item.description,
      image: imageIPFS,
      attributes: [
        { trait_type: 'rarity', value: item.rarity },
        { trait_type: 'type', value: item.type },
        { trait_type: 'playerItemId', value: playerItemId },
      ],
    };

    const tokenURI = await uploadJSONToIPFS(metadata);

    // 3️⃣ 🔐 ПОДПИСЬ
    const signer = new ethers.Wallet(process.env.MINT_SIGNER_KEY!);

    const hash = ethers.solidityPackedKeccak256(
      ['address', 'uint256', 'string', 'address'],
      [
        wallet,
        playerItemId,
        tokenURI,
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
      ]
    );

    const signature = await signer.signMessage(
      ethers.getBytes(hash)
    );

    // 4️⃣ ВОЗВРАТ ВСЕГО, ЧТО НУЖНО ФРОНТУ
    return res.status(200).json({
      itemId: playerItemId,
      tokenURI,
      signature,
    });

  } catch (e: any) {
    console.error('Mint API error:', e);
    return res.status(500).json({
      error: 'Mint prep failed',
      details: e.message,
    });
  } finally {
    client.release();
  }
}
