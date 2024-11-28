"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { PayBlock } from "@/components/Pay";
import { SignIn } from "@/components/SignIn";
import { VerifyBlock } from "@/components/Verify";
import { NFTInventory } from "@/components/NFTInventory/NFTInventory";
import { InventoryAuth } from "@/components/InventoryAuth/InventoryAuth";
import { EnhancedFeatures } from "@/components/EnhancedFeatures/EnhancedFeatures";
import { GameButton } from "@/components/ui/game-button";

export default function Home() {
  const { data: session } = useSession();
  const [isHumanVerified, setIsHumanVerified] = useState(false);
  const [verificationData, setVerificationData] = useState<any>(null);
  const [worldcoinAddress, setWorldcoinAddress] = useState<string>("");

  const handleVerificationSuccess = (data: any) => {
    console.log("World ID verification successful:", data);
    setVerificationData(data);
    setIsHumanVerified(true);
    
    if (data.worldcoinAddress) {
      console.log("Setting Worldcoin address in Home:", data.worldcoinAddress);
      setWorldcoinAddress(data.worldcoinAddress);
    } else {
      console.warn("No worldcoinAddress in verification data:", data);
    }
  };

  const hasFullAccess = session && isHumanVerified;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.main
      className="min-h-screen p-8 bg-gradient-to-b from-slate-50 to-slate-100"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Universal Game Assets Hub
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your cross-game inventory awaits. Manage all your digital assets in one secure location.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          variants={itemVariants}
        >
          {[
            {
              icon: "🎮",
              title: "Cross-Game Support",
              description: "One inventory for all your games"
            },
            {
              icon: "🔒",
              title: "Secure Access",
              description: "Protected by World ID verification"
            },
            {
              icon: "🌐",
              title: "Universal Access",
              description: "Available anywhere in the World App"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-2xl mb-2 block">{feature.icon}</span>
              <h3 className="font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {hasFullAccess ? (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <NFTInventory 
                isVerified={true} 
                worldcoinAddress={worldcoinAddress}
              />
            </motion.div>
          ) : (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <InventoryAuth 
                onVerificationSuccess={handleVerificationSuccess}
                isVerifying={false}
              >
                <div className="space-y-6">
                  {!session && (
                    <motion.div
                      variants={itemVariants}
                      className="bg-white/50 backdrop-blur-sm rounded-xl p-6"
                    >
                      <h3 className="text-lg font-semibold mb-4">Connect Your Account</h3>
                      <SignIn />
                    </motion.div>
                  )}
                  
                  {!isHumanVerified && (
                    <motion.div
                      variants={itemVariants}
                      className="bg-white/50 backdrop-blur-sm rounded-xl p-6"
                    >
                      <h3 className="text-lg font-semibold mb-4">Verify Your Identity</h3>
                      <VerifyBlock onVerificationSuccess={handleVerificationSuccess} />
                    </motion.div>
                  )}
                </div>
              </InventoryAuth>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Features Section */}
        <motion.div
          variants={itemVariants}
          className="mt-12"
        >
          <EnhancedFeatures />
        </motion.div>

        {/* Footer Status */}
        <motion.div
          variants={itemVariants}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p>Currently in beta • Built with World ID MiniKit v1.2.0</p>
        </motion.div>
      </div>
    </motion.main>
  );
}