import React, { useState } from 'react';
import { ethers } from 'ethers';

interface NFTItem {
  id: string;
  name: string;
  image_url: string;
  status: 'pending' | 'minted';
  rarity: string;
  blockchain_tx_hash?: string;
}

interface MintNFTProps {
  nft: NFTItem;
  wallet: string | null;
}

const MintNFT = ({ nft, wallet }: MintNFTProps) => {
  // здесь можно вызвать контракт с wallet
};

export default MintNFT;