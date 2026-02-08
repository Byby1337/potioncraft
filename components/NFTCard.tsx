import React from 'react';
import { PlayerItem } from './NFTList';

interface NFTCardProps {
  item: PlayerItem;
  onToggle: (id: number) => void;
  onMint: (id: number) => void;
}

export default function NFTCard({ item, onToggle, onMint }: NFTCardProps) {
  return (
    <div className={`nft-card ${item.minted ? 'minted' : ''}`}>
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}

      <div className="nft-info">
        <h3 className="nft-name">{item.name}</h3>
        <p className="nft-description">{item.description}</p>

        <div className="nft-footer">
          <span className={`rarity ${item.rarity.toLowerCase()}`}>
            {item.rarity.toUpperCase()}
          </span>

          <span className={`badge ${item.activated ? 'active' : 'inactive'}`}>
            {item.activated ? 'Active' : 'Inactive'}
          </span>
        </div>

{item.can_be_nft && !item.minted && (
  <button className="button blue mt-2 w-full" onClick={() => onMint(item.id)}>
    Mint NFT
  </button>
)}
        {/* Already Minted */}
        {item.minted && (
          <span className="inline-block px-3 py-1 rounded-full bg-yellow-400 text-black font-semibold text-sm text-center w-full mt-2">
            Minted
          </span>
        )}
      </div>
    </div>
  );
}
