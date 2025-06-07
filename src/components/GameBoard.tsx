
import GameTile from './GameTile';
import { LetterState } from '@/pages/Index';

interface GameBoardProps {
  gameBoard: LetterState[][];
  currentRow: number;
  currentCol: number;
}

const GameBoard = ({ gameBoard, currentRow, currentCol }: GameBoardProps) => {
  return (
    <div className="grid grid-rows-6 gap-2 mb-8 p-4">
      {gameBoard.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-5 gap-2">
          {row.map((cell, colIndex) => (
            <GameTile
              key={`${rowIndex}-${colIndex}`}
              letter={cell.letter}
              state={cell.state}
              isActive={rowIndex === currentRow && colIndex === currentCol}
              delay={colIndex * 100}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
