import { ethers } from 'ethers';
import type { GameNFT } from '@/types';

export const WORLDCOIN_CHAIN_CONFIG = {
  RPC_URL: "https://worldchain-sepolia.g.alchemy.com/public",
  CHAIN_ID: 4801,
  CHAIN_NAME: "wcsep",
  NFT_CONTRACT_ADDRESS: "0x9E92019881d5dE556a9C75A9e846dead8C1aa236"
};

const ERC1155_ABI = [
  "function balanceOf(address account, uint256 id) view returns (uint256)",
  "function uri(uint256 id) view returns (string)"
];

export const getProvider = () => {
  return new ethers.JsonRpcProvider(WORLDCOIN_CHAIN_CONFIG.RPC_URL);
};

export const getNFTContract = (provider: ethers.Provider) => {
  return new ethers.Contract(
    WORLDCOIN_CHAIN_CONFIG.NFT_CONTRACT_ADDRESS,
    ERC1155_ABI,
    provider
  );
};

export async function fetchWorldcoinNFTs(address: string): Promise<GameNFT[]> {
  try {
    console.log("Fetching NFTs for address:", address);
    const provider = getProvider();
    const contract = getNFTContract(provider);
    const nfts: GameNFT[] = [];

    // Check a wider range of token IDs
    const maxTokenId = 100; // Adjust this based on your expected maximum token ID
    
    for (let tokenId = 1; tokenId <= maxTokenId; tokenId++) {
      try {
        console.log(`Checking balance for token ${tokenId}`);
        const balance = await contract.balanceOf(address, tokenId);
        
        if (balance > 0) {
          console.log(`Found token ${tokenId} with balance ${balance}`);
          
          try {
            const metadataUrl = `https://boorich.github.io/NFT_Metadata/metadata/${tokenId}.json`;
            console.log('Fetching metadata from:', metadataUrl);
            
            const response = await fetch(metadataUrl);
            const metadata = await response.json();
            
            nfts.push({
              id: tokenId.toString(),
              name: metadata.name || `World ID Game Asset #${tokenId}`,
              game: "World ID",
              type: "Digital Asset",
              rarity: "Epic",
              status: "In-Game",
              image: metadata.image || "/images/nfts/placeholder.webp",
              description: metadata.description || `World ID Game Asset Token #${tokenId}`
            });
          } catch (metadataError) {
            console.warn(`Failed to fetch metadata for token ${tokenId}, using fallback`, metadataError);
            nfts.push({
              id: tokenId.toString(),
              name: `World ID Game Asset #${tokenId}`,
              game: "World ID",
              type: "Digital Asset",
              rarity: "Epic",
              status: "In-Game",
              image: "/images/nfts/placeholder.webp",
              description: `World ID Game Asset Token #${tokenId}`
            });
          }
        }
      } catch (error) {
        console.error(`Error fetching token ${tokenId}:`, error);
        continue;
      }
    }

    console.log("Final NFTs array:", nfts);
    return nfts;
  } catch (error) {
    console.error('Error fetching Worldcoin NFTs:', error);
    throw error;
  }
}