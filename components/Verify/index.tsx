"use client";
import {
  MiniKit,
  ResponseEvent,
  VerificationLevel,
  MiniAppVerifyActionPayload,
  ISuccessResult,
} from "@worldcoin/minikit-js";
import { useState, useEffect } from "react";

interface VerifyBlockProps {
  onVerificationSuccess: (verificationData: any) => void;
}

export const VerifyBlock = ({ onVerificationSuccess }: VerifyBlockProps) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [miniKitAvailable, setMiniKitAvailable] = useState(false);

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
              onVerificationSuccess(verifyResponseJson); // Added this line to trigger the callback
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
    };
  }, [onVerificationSuccess]); // Added onVerificationSuccess to dependency array

  return (
    <div>
      <h1>Verify Block</h1>
      <button
        className={`bg-green-500 p-4 ${isVerifying ? "opacity-50" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          triggerVerify().catch(console.error);
        }}
        disabled={isVerifying}
      >
        {isVerifying ? "Verifying..." : "Test Verify"}
      </button>
    </div>
  );
};