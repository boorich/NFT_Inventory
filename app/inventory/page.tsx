// app/inventory/page.tsx
"use client";

import { useState } from "react";
import { VerifyBlock } from "@/components/Verify";
import { NFTInventory } from "@/components/NFTInventory/NFTInventory";

export default function InventoryPage() {
  const [isVerified, setIsVerified] = useState(false);
  const [verificationData, setVerificationData] = useState<any>(null);

  const handleVerificationSuccess = (data: any) => {
    console.log("Verification successful:", data);
    setVerificationData(data);
    setIsVerified(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        {!isVerified ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Game Assets Inventory</h2>
            <p className="mb-4">Please verify with World ID to continue.</p>
            <VerifyBlock onVerificationSuccess={handleVerificationSuccess} />
          </>
        ) : (
          <NFTInventory isVerified={isVerified} />
        )}
      </div>
    </div>
  );
}