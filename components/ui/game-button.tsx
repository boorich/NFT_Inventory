// components/ui/game-button.tsx
interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children: React.ReactNode;
  }
  
  export const GameButton = ({ 
    variant = 'primary', 
    size = 'md', 
    isLoading, 
    children, 
    className = '',
    ...props 
  }: GameButtonProps) => {
    const baseStyles = "relative font-gaming transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg hover:shadow-indigo-500/50",
      secondary: "bg-gradient-to-r from-slate-800 to-slate-700 text-white shadow-md hover:shadow-slate-500/50",
      ghost: "bg-white/10 backdrop-blur-sm hover:bg-white/20 text-slate-700"
    };
  
    const sizes = {
      sm: "px-4 py-2 text-sm rounded-lg",
      md: "px-6 py-3 text-base rounded-xl",
      lg: "px-8 py-4 text-lg rounded-xl"
    };
  
    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          </div>
        ) : children}
      </button>
    );
  };