// utils/worldcoin-chain.ts
import { ethers } from 'ethers';
import type { GameNFT } from '@/types';

// Constants for Worldcoin chain
export const WORLDCOIN_CHAIN_CONFIG = {
  RPC_URL: "worldchain-sepolia.g.alchemy.com/public", 
  CHAIN_ID: 4801,
  CHAIN_NAME: "wcsep",
  NFT_CONTRACT_ADDRESS: "0x8253d2737604D0b82d024c544f3Ee48BFb1071e7"
};

// ERC1155 minimal ABI for balanceOf and URI
const ERC1155_ABI = [
  "function balanceOf(address account, uint256 id) view returns (uint256)",
  "function uri(uint256 id) view returns (string)",
  "function gameItems(uint256) view returns (string name, string game, string itemType, string rarity, uint256 maxSupply)"
];

// Initialize provider
export const getProvider = () => {
  return new ethers.JsonRpcProvider(WORLDCOIN_CHAIN_CONFIG.RPC_URL);
};

// Initialize contract
export const getNFTContract = (provider: ethers.Provider) => {
  return new ethers.Contract(
    WORLDCOIN_CHAIN_CONFIG.NFT_CONTRACT_ADDRESS,
    ERC1155_ABI,
    provider
  );
};

export async function fetchWorldcoinNFTs(address: string): Promise<GameNFT[]> {
  try {
    const provider = getProvider();
    const contract = getNFTContract(provider);
    const nfts: GameNFT[] = [];

    // We'll check tokens 0-10 for demonstration
    for (let tokenId = 0; tokenId < 10; tokenId++) {
      try {
        const balance = await contract.balanceOf(address, tokenId);
        
        if (balance > 0) {
          // Get the game item data
          const itemData = await contract.gameItems(tokenId);
          
          nfts.push({
            id: tokenId.toString(),
            name: itemData.name,
            game: itemData.game,
            type: itemData.itemType,
            rarity: itemData.rarity,
            status: "In-Game",
            image: "/placeholder.png",
            description: `${itemData.name} - A ${itemData.rarity} ${itemData.itemType} from ${itemData.game}`
          });
        }
      } catch (error) {
        console.error(`Error fetching token ${tokenId}:`, error);
        continue;
      }
    }

    return nfts;
  } catch (error) {
    console.error('Error fetching Worldcoin NFTs:', error);
    return [];
  }
}