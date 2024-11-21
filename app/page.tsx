"use client";

import { useState } from "react";
import { PayBlock } from "@/components/Pay";
import { SignIn } from "@/components/SignIn";
import { VerifyBlock } from "@/components/Verify";
import { NFTInventory } from "@/components/NFTInventory/NFTInventory";

export default function Home() {
  const [isVerified, setIsVerified] = useState(false);
  const [verificationData, setVerificationData] = useState<any>(null);

  const handleVerificationSuccess = (data: any) => {
    console.log("Verification successful:", data);
    setVerificationData(data);
    setIsVerified(true);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Cross-Game NFT Inventory Manager
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your universal hub for managing game assets across different universes. 
            Store, track, and organize your in-game NFTs and future game assets in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-3">Why Use Our Platform?</h2>
            <ul className="space-y-2 text-gray-600">
              <li>✨ Manage NFTs across multiple games</li>
              <li>🎮 Track both current and future game assets</li>
              <li>🔒 Secure verification with World ID</li>
              <li>🌐 Universal inventory system</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-3">Getting Started</h2>
            <ul className="space-y-2 text-gray-600">
              <li>1. Sign in with your account</li>
              <li>2. Verify your identity</li>
              <li>3. Access your universal inventory</li>
              <li>4. Start managing your game assets</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {!isVerified ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Access Your Inventory</h2>
                <p className="text-gray-600 mb-6">
                  Please complete these steps to access your universal game inventory
                </p>
              </div>
              <div className="max-w-md mx-auto space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">1. Sign In</h3>
                  <SignIn />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">2. Verify Identity</h3>
                  <VerifyBlock onVerificationSuccess={handleVerificationSuccess} />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">3. Payment Options</h3>
                  <PayBlock />
                </div>
              </div>
            </>
          ) : (
            <NFTInventory isVerified={isVerified} />
          )}
        </div>
      </div>
    </main>
  );
}