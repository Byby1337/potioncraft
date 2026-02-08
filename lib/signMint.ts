import { ethers } from "ethers";

const signer = new ethers.Wallet(process.env.SIGNER_PRIVATE_KEY!);

export async function signMint(
  player: string,
  itemId: number,
  tokenURI: string,
  contractAddress: string
) {
  const hash = ethers.solidityPackedKeccak256(
    ["address", "uint256", "string", "address"],
    [player, itemId, tokenURI, contractAddress]
  );

  return signer.signMessage(ethers.getBytes(hash));
}
