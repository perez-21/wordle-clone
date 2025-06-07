
import { cn } from '@/lib/utils';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyboardState: Record<string, 'correct' | 'present' | 'absent' | 'unused'>;
}

const Keyboard = ({ onKeyPress, keyboardState }: KeyboardProps) => {
  const topRow = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const middleRow = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const bottomRow = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  const getKeyClasses = (key: string) => {
    const state = keyboardState[key] || 'unused';
    const baseClasses = 'px-3 py-4 rounded-md font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95';
    
    switch (state) {
      case 'correct':
        return cn(baseClasses, 'bg-green-500 text-white');
      case 'present':
        return cn(baseClasses, 'bg-yellow-500 text-white');
      case 'absent':
        return cn(baseClasses, 'bg-gray-500 text-white');
      default:
        return cn(baseClasses, 'bg-gray-200 text-gray-800 hover:bg-gray-300');
    }
  };

  const specialKeyClasses = 'px-4 py-4 rounded-md font-bold text-sm bg-gray-300 text-gray-800 hover:bg-gray-400 transition-all duration-200 hover:scale-105 active:scale-95';

  return (
    <div className="w-full max-w-lg mx-auto space-y-2">
      {/* Top Row */}
      <div className="flex justify-center gap-1">
        {topRow.map(key => (
          <button
            key={key}
            onClick={() => onKeyPress(key)}
            className={getKeyClasses(key)}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Middle Row */}
      <div className="flex justify-center gap-1">
        {middleRow.map(key => (
          <button
            key={key}
            onClick={() => onKeyPress(key)}
            className={getKeyClasses(key)}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="flex justify-center gap-1">
        <button
          onClick={() => onKeyPress('ENTER')}
          className={specialKeyClasses}
        >
          ENTER
        </button>
        
        {bottomRow.map(key => (
          <button
            key={key}
            onClick={() => onKeyPress(key)}
            className={getKeyClasses(key)}
          >
            {key}
          </button>
        ))}
        
        <button
          onClick={() => onKeyPress('BACKSPACE')}
          className={specialKeyClasses}
        >
          ⌫
        </button>
      </div>
    </div>
  );
};

export default Keyboard;
