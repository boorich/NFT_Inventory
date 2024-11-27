// utils/worldcoin-chain.ts
import { ethers } from 'ethers';
import type { GameNFT } from '@/types';

// Constants for Worldcoin chain
export const WORLDCOIN_CHAIN_CONFIG = {
  // These values need to be replaced with actual Worldcoin chain details
  RPC_URL: "worldchain-sepolia.g.alchemy.com/public", 
  CHAIN_ID: 4801, // Example chain ID
  CHAIN_NAME: "wcsep",
  NFT_CONTRACT_ADDRESS: "0x8253d2737604D0b82d024c544f3Ee48BFb1071e7" // Some random NFT contract address (Fire Token)
};

// Standard ERC721 ABI for NFT interactions
export const ERC721_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function name() view returns (string)",
  "function symbol() view returns (string)"
];

// Initialize provider
export const getProvider = () => {
  return new ethers.JsonRpcProvider(WORLDCOIN_CHAIN_CONFIG.RPC_URL);
};

// Initialize contract
export const getNFTContract = (provider: ethers.Provider) => {
  return new ethers.Contract(
    WORLDCOIN_CHAIN_CONFIG.NFT_CONTRACT_ADDRESS, 
    ERC721_ABI, 
    provider
  );
};

// Function to fetch NFT metadata from IPFS or other storage
async function fetchMetadata(uri: string) {
  // If IPFS URI, convert to HTTP gateway
  const httpUri = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
  
  try {
    const response = await fetch(httpUri);
    const metadata = await response.json();
    return metadata;
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return null;
  }
}

// Main function to fetch NFTs for a wallet
export async function fetchWorldcoinNFTs(address: string): Promise<GameNFT[]> {
  const provider = getProvider();
  const contract = getNFTContract(provider);
  
  try {
    // Get total NFTs owned by address
    const balance = await contract.balanceOf(address);
    const balanceNumber = Number(balance);
    
    // Fetch each NFT
    const nfts: GameNFT[] = [];
    
    for (let i = 0; i < balanceNumber; i++) {
      try {
        // Get token ID
        const tokenId = await contract.tokenOfOwnerByIndex(address, i);
        
        // Get token URI
        const tokenUri = await contract.tokenURI(tokenId);
        
        // Fetch metadata
        const metadata = await fetchMetadata(tokenUri);
        
        if (metadata) {
          nfts.push({
            id: tokenId.toString(),
            name: metadata.name || `NFT #${tokenId}`,
            game: metadata.properties?.game || 'Unknown Game',
            type: metadata.properties?.type || 'Unknown',
            rarity: metadata.properties?.rarity || 'Common',
            status: metadata.properties?.status || 'In-Game',
            image: metadata.image || '/placeholder.png',
            description: metadata.description || 'No description available'
          });
        }
      } catch (error) {
        console.error(`Error fetching NFT at index ${i}:`, error);
        continue;
      }
    }
    
    return nfts;
  } catch (error) {
    console.error('Error fetching Worldcoin NFTs:', error);
    throw error;
  }
}

// Error types for better error handling
export class WorldcoinChainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WorldcoinChainError';
  }
}

export class NFTFetchError extends WorldcoinChainError {
  constructor(message: string) {
    super(message);
    this.name = 'NFTFetchError';
  }
}