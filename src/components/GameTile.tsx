
import { cn } from '@/lib/utils';

interface GameTileProps {
  letter: string;
  state: 'correct' | 'present' | 'absent' | 'empty';
  isActive?: boolean;
  delay?: number;
}

const GameTile = ({ letter, state, isActive = false, delay = 0 }: GameTileProps) => {
  const getStateClasses = () => {
    switch (state) {
      case 'correct':
        return 'bg-green-500 border-green-500 text-white';
      case 'present':
        return 'bg-yellow-500 border-yellow-500 text-white';
      case 'absent':
        return 'bg-gray-500 border-gray-500 text-white';
      default:
        return letter 
          ? 'bg-background border-gray-400 text-foreground border-2' 
          : 'bg-background border-gray-300 text-foreground';
    }
  };

  return (
    <div
      className={cn(
        'w-12 h-12 border-2 flex items-center justify-center text-lg font-bold transition-all duration-300 rounded-sm',
        getStateClasses(),
        isActive && 'border-gray-600 scale-105',
        state !== 'empty' && letter && 'animate-scale-in'
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {letter}
    </div>
  );
};

export default GameTile;
