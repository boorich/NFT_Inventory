import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useSimulateContract } from 'wagmi';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GameNFT } from '@/types';
import { isAddress } from 'viem';
import { GameAssetsABI } from '@/abis/GameAssets';
import { toast } from 'sonner';

interface TransferNFT extends GameNFT {
  contractAddress: `0x${string}`;
  tokenId: string;
}

interface TransferModalProps {
  nft: TransferNFT;
  isOpen: boolean;
  onClose: () => void;
}

export function TransferModal({ nft, isOpen, onClose }: TransferModalProps) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('1');
  const { address } = useAccount();
  
  // Get user's balance of this NFT
  const { data: balance } = useReadContract({
    address: nft.contractAddress,
    abi: GameAssetsABI,
    functionName: 'balanceOf',
    args: address && nft.tokenId ? [address, BigInt(nft.tokenId)] : undefined,
    query: {
      enabled: Boolean(address && nft.tokenId),
    },
  });

  // Prepare the transfer transaction
  const { data: simulateData } = useSimulateContract({
    address: nft.contractAddress,
    abi: GameAssetsABI,
    functionName: 'safeTransferFrom',
    args: address && recipient && nft.tokenId && amount ? [
      address,
      recipient as `0x${string}`,
      BigInt(nft.tokenId),
      BigInt(amount),
      '0x' // No data needed
    ] : undefined,
    query: {
      enabled: Boolean(
        address && 
        isAddress(recipient) && 
        nft.tokenId &&
        Number(amount) > 0 && 
        balance && 
        Number(amount) <= Number(balance)
      ),
    },
  });

  const { writeContract, isSuccess, isError, isPending, data: txData } = useWriteContract();

  // Handle successful transfer
  if (isSuccess && txData) {
    toast.success('NFT Transfer Initiated', {
      description: `Transaction Hash: ${txData}`,
    });
    onClose();
  }

  if (isError) {
    toast.error('Transfer failed', {
      description: 'Please try again',
    });
  }

  const handleTransfer = () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!isAddress(recipient)) {
      toast.error('Invalid recipient address');
      return;
    }

    if (!balance || Number(amount) <= 0 || Number(amount) > Number(balance)) {
      toast.error('Invalid transfer amount');
      return;
    }

    if (simulateData?.request) {
      writeContract(simulateData.request);
    } else {
      toast.error('Unable to prepare transaction');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer {nft.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!address ? (
            <p className="text-sm text-yellow-600">
              Please connect your wallet to transfer NFTs
            </p>
          ) : (
            <>
              <div>
                <Label>Recipient Address</Label>
                <Input 
                  placeholder="0x..." 
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
                {recipient && !isAddress(recipient) && (
                  <p className="text-sm text-red-500 mt-1">
                    Please enter a valid address
                  </p>
                )}
              </div>
              
              {balance && Number(balance) > 1 && (
                <div>
                  <Label>Amount to Transfer</Label>
                  <Input 
                    type="number"
                    min="1"
                    max={balance?.toString()}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <p className="text-sm text-gray-500">
                    You own {balance?.toString()} of this item
                  </p>
                </div>
              )}
              
              <Button
                className="w-full"
                disabled={!simulateData?.request || isPending}
                onClick={handleTransfer}
              >
                {isPending ? 'Confirming...' : 'Transfer'}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Please confirm the transaction in your wallet
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}