// components/NFTInventory/NFTInventory.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Grid3X3, List } from "lucide-react";
import type { GameNFT } from "@/types";
import { FlippableCard } from "../NFTCard/FlippableCard"; 

const MOCK_NFTS: GameNFT[] = [
  {
    id: "1",
    name: "Celestial Blade of the Eternal",
    game: "Skyforge Legends",
    type: "Weapon",
    rarity: "Mythical",
    status: "In-Game",
    image: "/images/nfts/1.webp",
    description: "A legendary sword that channels celestial energy"
  },
  {
    id: "2",
    name: "Swift Shadowmere Mount",
    game: "Realm of Shadows",
    type: "Mount",
    rarity: "Epic",
    status: "In-Game",
    image: "/images/nfts/2.webp",
    description: "A mythical steed with unmatched speed"
  },
  {
    id: "3",
    name: "Dragon's Heart Amulet",
    game: "Dragon Saga Online",
    type: "Accessory",
    rarity: "Legendary",
    status: "Future Asset",
    image: "/images/nfts/3.webp",
    description: "Contains the power of an ancient dragon"
  },
  {
    id: "4",
    name: "Quantum Pulse Rifle",
    game: "Neon Frontier 2077",
    type: "Weapon",
    rarity: "Rare",
    status: "In-Game",
    image: "/images/nfts/4.webp",
    description: "Next-gen energy weapon with quantum capabilities"
  },
  {
    id: "5",
    name: "Mecha Titan Armor Set",
    game: "Mech Warriors Rising",
    type: "Armor",
    rarity: "Epic",
    status: "Future Asset",
    image: "/images/nfts/5.webp",
    description: "Full-body combat suit with advanced AI integration"
  },
  {
    id: "6",
    name: "Ancient Spellbook",
    game: "Mystic Realms",
    type: "Spell Item",
    rarity: "Legendary",
    status: "In-Game",
    image: "/images/nfts/6.webp",
    description: "Contains forbidden knowledge of the old world"
  }
];

const RARITY_COLORS = {
  Common: "bg-gray-100",
  Uncommon: "bg-green-100",
  Rare: "bg-blue-100",
  Epic: "bg-purple-100",
  Legendary: "bg-orange-100",
  Mythical: "bg-red-100"
};

export function NFTInventory({ isVerified }: { isVerified: boolean }) {
  const [inventory, setInventory] = useState<GameNFT[]>(MOCK_NFTS);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const FilterBar = () => (
    <div className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-lg mb-4 shadow-sm">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search assets..."
            className="pl-10 p-2 w-full rounded-md border border-gray-200 bg-white/70"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className={`p-2 rounded-md border ${viewMode === 'grid' ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-200'}`}
          onClick={() => setViewMode('grid')}
        >
          <Grid3X3 className="h-5 w-5 text-gray-600" />
        </button>
        <button
          className={`p-2 rounded-md border ${viewMode === 'list' ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-200'}`}
          onClick={() => setViewMode('list')}
        >
          <List className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </div>
  );

  const NFTGrid = ({ items }: { items: GameNFT[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
      {items.map((nft) => (
        <FlippableCard key={nft.id} nft={nft} />
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto bg-gray-50/50 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-white/70">
        <h2 className="text-2xl font-bold text-gray-800">Game Assets Inventory</h2>
        <p className="text-gray-600">Manage your cross-game NFT collection</p>
      </div>

      <div className="p-6">
        <FilterBar />
        
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {['All', 'Weapons', 'Armor', 'Mounts', 'Accessories'].map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                activeFilter === filter.toLowerCase()
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveFilter(filter.toLowerCase())}
            >
              {filter}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your inventory...</p>
          </div>
        ) : (
          <NFTGrid items={inventory} />
        )}
      </div>
    </div>
  );
}