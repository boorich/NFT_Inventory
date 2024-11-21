// components/InventoryAuth/InventoryAuth.tsx
import { useState, ReactNode } from 'react';
import { GameButton } from '../ui/game-button';
import { motion } from 'framer-motion';

interface InventoryAuthProps {
  onVerificationSuccess: (data: unknown) => void;
  isVerifying: boolean;
  children: ReactNode;
}

export const InventoryAuth = ({ 
  onVerificationSuccess, 
  isVerifying, 
  children 
}: InventoryAuthProps) => {
  const [authStep, setAuthStep] = useState<'intro' | 'verify'>('intro');

  const handleBeginVerification = () => {
    setAuthStep('verify');
    // If you need to call onVerificationSuccess at some point:
    // onVerificationSuccess(someData);
  };

  const steps = {
    intro: {
      title: "Access Your Universal Inventory",
      content: (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4">🎮 Universal Game Assets</h3>
            <p className="text-gray-600">
              Your cross-game inventory awaits. Verify your identity to access:
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-indigo-500">⚔️</span> 
                <span>Current game items</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-500">🎲</span> 
                <span>Future game assets</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">🌟</span> 
                <span>Cross-game collections</span>
              </li>
            </ul>
          </div>
          
          <div className="flex justify-center">
            <GameButton 
              variant="primary"
              size="lg"
              onClick={handleBeginVerification}
              isLoading={isVerifying}
            >
              Begin Verification
            </GameButton>
          </div>
        </div>
      )
    },
    verify: {
      title: "Human Verification Required",
      content: (
        <div className="space-y-6">
          <div className="p-6 bg-white/50 rounded-2xl backdrop-blur-sm">
            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-indigo-100 rounded-full mb-4">
                🔒
              </div>
              <h3 className="text-xl font-bold">Secure Your Inventory</h3>
              <p className="text-gray-600 mt-2">
                Verify with World ID to protect your assets from unauthorized access
              </p>
            </div>
            
            {children}
          </div>
        </div>
      )
    }
  } as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {steps[authStep].title}
          </h2>
        </div>
        
        <div className="p-8">
          {steps[authStep].content}
        </div>
      </div>
    </motion.div>
  );
};