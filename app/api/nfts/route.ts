// app/api/nfts/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // This is where you'd implement your NFT fetching logic
  // For now, returning mock data
  const mockNFTs = [
    {
      id: '1',
      name: 'Legendary Sword',
      game: 'Game1',
      type: 'Weapon',
      rarity: 'Legendary',
      status: 'In-Game',
      image: '/api/placeholder/200/200'
    },
    // Add more mock NFTs...
  ];

  return NextResponse.json(mockNFTs);
}