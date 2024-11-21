// types.ts
export interface GameNFT {
    id: string;
    name: string;
    game: string;
    type: string;
    rarity: string;
    status: 'In-Game' | 'Future Asset';
    image: string;
  }
  
  export interface NFTInventoryProps {
    isVerified: boolean;
    userAddress?: string; // If using wallet connection
  }