import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import NFTCard from './NFTCard';
import { ethers } from 'ethers';
import GameItemNFT   from '../abi/GameItemNFT.json';

export interface PlayerItem {
  id: number;
  name: string;
  description: string;
  rarity: string;
  activated: boolean;
  can_be_nft: boolean;
  minted: boolean;
  image_url?: string;
}

const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythical'];

export default function NFTList() {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;

  const [items, setItems] = useState<PlayerItem[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!walletAddress) {
      setItems([]);
      setSelectedRarities([]);
      setLoading(false);
      setError('Connect your wallet to view items');
      return;
    }

    const fetchItems = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/player-items?wallet=${walletAddress}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data: PlayerItem[] = await res.json();
        setItems(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [walletAddress]);

  const toggleRarity = (rarity: string) => {
    setSelectedRarities(prev =>
      prev.includes(rarity)
        ? prev.filter(r => r !== rarity)
        : [...prev, rarity]
    );
  };


const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

const handleMint = async (playerItemId: number) => {
  try {
    setLoading(true);

    const res = await fetch("/api/mint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet: walletAddress,
        playerItemId,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    const { itemId, tokenURI, signature } = data;

    if (!itemId || !tokenURI || !signature) {
      throw new Error("Invalid mint response");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      GameItemNFT.abi,
      signer
    );

    const tx = await contract.mintWithSignature(
      BigInt(itemId),
      tokenURI,
      ethers.getBytes(signature)
    );

    await tx.wait();

    await fetch("/api/markMinted", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerItemId }),
    });

    alert("NFT minted successfully");
  } catch (e: any) {
    console.error(e);
    alert(e.message);
  } finally {
    setLoading(false);
  }
};



const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111

async function switchToSepolia() {
  const currentChain = await window.ethereum.request({
    method: 'eth_chainId',
  });

  if (currentChain === SEPOLIA_CHAIN_ID) return;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SEPOLIA_CHAIN_ID }],
    });
  } catch (err: any) {
    // если сеть не добавлена
    if (err.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: SEPOLIA_CHAIN_ID,
            chainName: 'Sepolia Testnet',
            rpcUrls: ['https://rpc.sepolia.org'],
            nativeCurrency: {
              name: 'Sepolia ETH',
              symbol: 'ETH',
              decimals: 18,
            },
            blockExplorerUrls: ['https://sepolia.etherscan.io'],
          },
        ],
      });
    } else {
      throw err;
    }
  }
}


  const filteredItems = selectedRarities.length
    ? items.filter(item => selectedRarities.includes(item.rarity))
    : items;

  return (
    <div className="nft-page">
      <h2 className="page-title">Your Items</h2>

      <div className="filters">
        {rarities.map(r => (
          <button
            key={r}
            onClick={() => toggleRarity(r)}
            className={`button filter ${selectedRarities.includes(r) ? 'active' : ''}`}
          >
            {r}
          </button>
        ))}
      </div>

      {loading && <p className="empty">Loading Items...</p>}
      {error && <p className="error">{error}</p>}

      <div className="nft-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <NFTCard
              key={item.id}
              item={item}
              onToggle={() => {}}
              onMint={handleMint}
            />
          ))
        ) : (
          <p className="empty">No items found for this filter.</p>
        )}
      </div>
    </div>
  );
}
