interface PlayerItem {
  id: number;
  name: string;
  description: string;
  rarity: string;
  activated: boolean;
  can_be_nft: boolean;
  minted: boolean;
  image_url?: string;
}