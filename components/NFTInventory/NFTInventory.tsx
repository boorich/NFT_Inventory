// components/NFTInventory/NFTInventory.tsx
"use client";

import { useState, useEffect } from "react";
import type { GameNFT, NFTInventoryProps } from "@/types";

export function NFTInventory({ isVerified }: NFTInventoryProps) {
  const [inventory, setInventory] = useState<GameNFT[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (isVerified) {
      fetchNFTs().catch(console.error);
    }
  }, [isVerified]);

  const fetchNFTs = async () => {
    try {
      const response = await fetch('/api/nfts');
      if (!response.ok) throw new Error('Failed to fetch NFTs');
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  const FilterBar = () => (
    <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg mb-4">
      <div className="flex-1">
        <div className="relative">
          <input
            type="text"
            placeholder="Search assets..."
            className="pl-10 p-2 w-full rounded-md border border-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <button className="flex items-center gap-2 p-2 border rounded-md">
        Filters
      </button>
      <div className="flex gap-2 border rounded-md p-1">
        <button
          className={`p-1 rounded ${viewMode === 'grid' ? 'bg-gray-200' : ''}`}
          onClick={() => setViewMode('grid')}
        >
          Grid
        </button>
        <button
          className={`p-1 rounded ${viewMode === 'list' ? 'bg-gray-200' : ''}`}
          onClick={() => setViewMode('list')}
        >
          List
        </button>
      </div>
    </div>
  );

  const NFTGrid = ({ items }: { items: GameNFT[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((nft) => (
        <div key={nft.id} className="bg-white rounded-lg shadow overflow-hidden">
          <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="font-bold text-lg">{nft.name}</h3>
            <div className="text-sm text-gray-500">
              <p>Game: {nft.game}</p>
              <p>Type: {nft.type}</p>
              <p>Status: {nft.status}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const NFTList = ({ items }: { items: GameNFT[] }) => (
    <div className="space-y-2">
      {items.map((nft) => (
        <div key={nft.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-4">
            <img src={nft.image} alt={nft.name} className="w-16 h-16 object-cover rounded" />
            <div>
              <h3 className="font-bold">{nft.name}</h3>
              <div className="text-sm text-gray-500">
                <p>Game: {nft.game} | Type: {nft.type} | Status: {nft.status}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Game Assets Manager</h2>
        
        <div className="mb-6">
          <div className="flex gap-4 border-b">
            <button
              className={`px-4 py-2 ${activeTab === 'all' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Games
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'in-game' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('in-game')}
            >
              In-Game Assets
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'future' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('future')}
            >
              Future Assets
            </button>
          </div>
        </div>

        {activeTab === 'all' && (
          <>
            <FilterBar />
            {loading ? (
              <div className="text-center py-8">Loading your inventory...</div>
            ) : (
              viewMode === 'grid' ? 
                <NFTGrid items={inventory} /> : 
                <NFTList items={inventory} />
            )}
          </>
        )}
      </div>
    </div>
  );
}