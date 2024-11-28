"use client";
import {
  MiniKit,
  ResponseEvent,
  VerificationLevel,
  MiniAppVerifyActionPayload,
  ISuccessResult,
} from "@worldcoin/minikit-js";
import { useState, useEffect } from "react";
import { GameButton } from "../ui/game-button";
import { motion } from "framer-motion";

interface VerifyBlockProps {
  onVerificationSuccess: (verificationData: any) => void;
}

export const VerifyBlock = ({ onVerificationSuccess }: VerifyBlockProps) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [miniKitAvailable, setMiniKitAvailable] = useState(false);
  const [worldAddress, setWorldAddress] = useState<string | null>(null);

  const triggerVerify = async () => {
    setIsVerifying(true);
    const verifyPayload = {
      action: "user-verification-for-inventory",
      signal: "",
      verification_level: VerificationLevel.Orb,
    };

    console.log("Triggering verification with payload:", verifyPayload);
    try {
      const result = await MiniKit.commands.verify(verifyPayload);
      console.log("MiniKit.commands.verify result:", result);
    } catch (error) {
      console.error("Error during verification:", error);
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    console.log("Checking MiniKit installation...");
    if (!MiniKit.isInstalled()) {
      console.error("MiniKit is not installed");
      return;
    }
    console.log("MiniKit is installed, setting up subscription...");

    // Get the World App address
    const address = (window as any).WorldApp?.address;
    console.log("World App address:", address);
    setWorldAddress(address);
    setMiniKitAvailable(true);

    MiniKit.subscribe(
      ResponseEvent.MiniAppVerifyAction,
      async (response: MiniAppVerifyActionPayload) => {
        console.log("Raw response:", response);

        if ("status" in response) {
          console.log("Status found in response:", response.status);

          if (response.status === "success") {
            console.log("Success response data:", response);
            try {
              const verifyResponse = await fetch("/api/verify", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  payload: response,
                  action: "user-verification-for-inventory",
                  signal: "",
                }),
              });

              if (!verifyResponse.ok) {
                throw new Error(`HTTP error! status: ${verifyResponse.status}`);
              }

              const verifyResponseJson = await verifyResponse.json();
              console.log("Backend verification response:", verifyResponseJson);

              // Pass along the World App address with the verification data
              onVerificationSuccess({
                ...verifyResponseJson,
                worldcoinAddress: worldAddress || "0xa78e078eccdedb6d247b0300ffcdef1cca6f8949" // fallback for testing
              });
            } catch (error) {
              console.error("Error during backend verification:", error);
            }
          } else {
            console.error("Verification failed:", response);
          }
        } else {
          console.error("Unexpected response format:", response);
        }

        setIsVerifying(false);
      }
    );

    return () => {
      MiniKit.unsubscribe(ResponseEvent.MiniAppVerifyAction);
      console.log("Cleanup: Unsubscribed from MiniKit events");
    };
  }, [onVerificationSuccess]);

  return (
    <motion.div 
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center space-y-3">
        <motion.div
          className="inline-block p-3 bg-indigo-100 rounded-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-2xl">🔐</span>
        </motion.div>
      </div>

      {worldAddress && (
        <p className="text-sm text-gray-600">
          World App Address: {worldAddress.slice(0, 6)}...{worldAddress.slice(-4)}
        </p>
      )}

      <GameButton
        variant="primary"
        size="lg"
        onClick={(e) => {
          e.preventDefault();
          triggerVerify().catch(console.error);
        }}
        disabled={isVerifying}
        isLoading={isVerifying}
      >
        {isVerifying ? "Verifying..." : "Verify with World ID"}
      </GameButton>

      {!miniKitAvailable && (
        <p className="text-sm text-red-500 text-center mt-2">
          Please open this app in World App to verify
        </p>
      )}
    </motion.div>
  );
};