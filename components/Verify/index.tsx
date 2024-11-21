"use client";
import {
  MiniKit,
  ResponseEvent,
  VerificationLevel,
  MiniAppVerifyActionPayload,
  ISuccessResult,
} from "@worldcoin/minikit-js";
import { useState, useEffect } from "react";

export const VerifyBlock = () => {
  const [isVerifying, setIsVerifying] = useState(false);

  const triggerVerify = () => {
    setIsVerifying(true);
    const verifyPayload = {
      action: "user-verification-for-inventory", 
      signal: "",
      verification_level: VerificationLevel.Orb,
    };
    console.log("Triggering verification with payload:", verifyPayload);
    const result = MiniKit.commands.verify(verifyPayload);
    console.log("MiniKit.commands.verify result:", result);
  };
  

  useEffect(() => {
    if (!MiniKit.isInstalled()) {
      console.error("MiniKit is not installed");
      return;
    }

    MiniKit.subscribe(
      ResponseEvent.MiniAppVerifyAction,
      async (response: MiniAppVerifyActionPayload) => {
        console.log("Received MiniAppVerifyAction response:", response);

        if (response.status === "error") {
          console.error("Verification failed with error:", response);
          setIsVerifying(false);
          return;
        }

        console.log("Sending payload to backend for verification...");
        try {
          const verifyResponse = await fetch("/api/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              payload: response as ISuccessResult,
              action: "user-verification-for-inventory", // Replace with your action ID
              signal: "", // Optional signal, adjust if necessary
            }),
          });

          const verifyResponseJson = await verifyResponse.json();
          console.log("Backend verification response:", verifyResponseJson);

          if (verifyResponseJson.status === 200) {
            console.log("Verification success!");
          } else {
            console.error("Backend verification failed:", verifyResponseJson);
          }
        } catch (error) {
          console.error("Error during backend verification:", error);
        } finally {
          setIsVerifying(false);
        }
      }
    );

    return () => {
      MiniKit.unsubscribe(ResponseEvent.MiniAppVerifyAction);
    };
  }, []);

  return (
    <div>
      <h1>Verify Block</h1>
      <button
        className={`bg-green-500 p-4 ${isVerifying ? "opacity-50" : ""}`}
        onClick={triggerVerify}
        disabled={isVerifying}
      >
        {isVerifying ? "Verifying..." : "Test Verify"}
      </button>
    </div>
  );
};
