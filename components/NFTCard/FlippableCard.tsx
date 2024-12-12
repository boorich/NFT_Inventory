// components/NFTCard/FlippableCard.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { GameButton } from '../ui/game-button';
import { Share2, ArrowRightLeft, Info, Shield, Twitter, Facebook, Copy, Check } from 'lucide-react';
import type { GameNFT } from '@/types';
import { TransferModal } from './modals/TransferModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import type { MouseEvent } from 'react';

const RARITY_COLORS = {
  Common: "bg-gray-100",
  Uncommon: "bg-green-100",
  Rare: "bg-blue-100",
  Epic: "bg-purple-100",
  Legendary: "bg-orange-100",
  Mythical: "bg-red-100"
} as const;

interface FlippableCardProps {
  nft: GameNFT & {
    contractAddress: `0x${string}`;
    tokenId: string;
  };
}

export const FlippableCard = ({ nft }: FlippableCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/nft/${nft.id}` : '';
  const shareText = `Check out my ${nft.name} NFT from ${nft.game}!`;

  const handleShare = async (platform: 'twitter' | 'facebook' | 'copy') => {
    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          '_blank'
        );
        break;
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          '_blank'
        );
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareUrl);
          setIsCopied(true);
          toast.success('Link copied to clipboard!');
          setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
          toast.error('Failed to copy link');
        }
        break;
    }
  };

  return (
    <motion.div 
      className="relative w-full h-[400px] cursor-pointer"
      whileHover={{ scale: 1.02 }}
    >
      <motion.div
        className="w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ transformStyle: "preserve-3d" }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of card */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full">
            <div className="aspect-square relative overflow-hidden bg-gray-100">
              <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
              <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
                RARITY_COLORS[nft.rarity as keyof typeof RARITY_COLORS]
              }`}>
                {nft.rarity}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg leading-tight">{nft.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{nft.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                  {nft.game}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  nft.status === 'Future Asset' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {nft.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div 
          className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden"
        >
          <div className="h-full flex flex-col p-6">
            {/* Header */}
            <div className="text-center mb-4">
              <h3 className="font-bold text-xl text-white mb-1">{nft.name}</h3>
              <p className="text-sm text-gray-300">Asset Management</p>
            </div>

            {/* Main actions grid */}
            <div className="grid grid-cols-2 gap-3 flex-1">
              <button 
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white"
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
                  setShowTransferModal(true);
                }}
              >
                <ArrowRightLeft className="w-5 h-5 mb-1" />
                <span className="text-sm">Transfer</span>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white"
                    onClick={(e: MouseEvent) => e.stopPropagation()}
                  >
                    <Share2 className="w-5 h-5 mb-1" />
                    <span className="text-sm">Share</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-48" 
                  onClick={(e: MouseEvent) => e.stopPropagation()}
                >
                  <DropdownMenuItem 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleShare('twitter')}
                  >
                    <Twitter className="w-4 h-4" />
                    Share on Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleShare('facebook')}
                  >
                    <Facebook className="w-4 h-4" />
                    Share on Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleShare('copy')}
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    Copy Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <button 
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white"
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
                  // Handle details
                }}
              >
                <Info className="w-5 h-5 mb-1" />
                <span className="text-sm">Details</span>
              </button>

              <button 
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white"
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
                  // Handle protect
                }}
              >
                <Shield className="w-5 h-5 mb-1" />
                <span className="text-sm">Protect</span>
              </button>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-4 space-y-2">
              <div className="text-xs text-gray-400">
                Last Updated: {new Date().toLocaleDateString()}
              </div>
              <GameButton
                variant="ghost"
                size="sm"
                className="w-full text-white hover:text-white hover:bg-white/10"
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
                  // Handle more options
                }}
              >
                More Options
              </GameButton>
            </div>
          </div>
        </div>
      </motion.div>

      <TransferModal 
        nft={nft}
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
      />
    </motion.div>
  );
};