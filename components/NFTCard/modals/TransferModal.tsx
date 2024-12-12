import { useState } from 'react';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GameNFT } from '@/types';
import { isAddress } from 'viem';
import { GameAssetsABI } from '@/abis/GameAssets';
import { toast } from 'sonner';

interface TransferModalProps {
  nft: GameNFT;
  isOpen: boolean;
  onClose: () => void;
}

export function TransferModal({ nft, isOpen, onClose }: TransferModalProps) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('1');
  const { address } = useAccount();
  
  // Get user's balance of this NFT
  const { data: balance } = useContractRead({
    address: nft.contractAddress as `0x${string}`,
    abi: GameAssetsABI,
    functionName: 'balanceOf',
    args: [address!, BigInt(nft.tokenId)],
  });

  // Prepare the transfer transaction
  const { config } = usePrepareContractWrite({
    address: nft.contractAddress as `0x${string}`,
    abi: GameAssetsABI,
    functionName: 'safeTransferFrom',
    args: [
      address!,
      recipient as `0x${string}`,
      BigInt(nft.tokenId),
      BigInt(amount),
      '0x' // No data needed
    ],
    enabled: isAddress(recipient) && Number(amount) > 0 && Number(amount) <= (balance as bigint),
  });

  const { write, isLoading, isSuccess, data } = useContractWrite(config);

  // Handle successful transfer
  if (isSuccess && data?.hash) {
    toast.success('NFT Transfer Initiated', {
      description: `Transaction Hash: ${data.hash}`,
    });
    onClose();
  }

  const handleTransfer = () => {
    if (!isAddress(recipient)) {
      toast.error('Invalid recipient address');
      return;
    }

    if (Number(amount) <= 0 || Number(amount) > (balance as bigint)) {
      toast.error('Invalid transfer amount');
      return;
    }

    write?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer {nft.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
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
          
          {Number(balance) > 1 && (
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
            disabled={!write || isLoading}
            onClick={handleTransfer}
          >
            {isLoading ? 'Confirming...' : 'Transfer'}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Please confirm the transaction in your wallet
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}