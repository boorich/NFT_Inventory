// components/EnhancedFeatures/EnhancedFeatures.tsx
import { GameButton } from '../ui/game-button';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all duration-200">
    <div className="text-3xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

export const EnhancedFeatures = () => {
  const features: FeatureCardProps[] = [
    {
      icon: "⚡️",
      title: "Priority Access",
      description: "Get early access to new game assets and exclusive drops"
    },
    {
      icon: "🔄",
      title: "Cross-Chain Transfer",
      description: "Move assets between supported blockchains seamlessly"
    },
    {
      icon: "💎",
      title: "Premium Storage",
      description: "Enhanced storage space for your growing collection"
    }
  ];

  return (
    <div className="mt-12">
      <div className="bg-gradient-to-r from-slate-900 to-purple-900 rounded-3xl overflow-hidden shadow-xl">
        <div className="px-8 py-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">Enhanced Features</h2>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <GameButton variant="primary" size="lg">
              Upgrade Your Experience
            </GameButton>
          </div>
        </div>
      </div>
    </div>
  );
};