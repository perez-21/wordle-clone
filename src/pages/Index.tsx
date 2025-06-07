
import { useState, useEffect } from 'react';
import GameBoard from '@/components/GameBoard';
import Keyboard from '@/components/Keyboard';
import { useToast } from '@/hooks/use-toast';

const WORDS = [
  'REACT', 'WORLD', 'GAMES', 'PHONE', 'MONEY', 'LIGHT', 'MUSIC', 'PARTY', 
  'HOUSE', 'WATER', 'POWER', 'SPACE', 'HEART', 'MAGIC', 'DREAM', 'SMILE',
  'BEACH', 'DANCE', 'PEACE', 'STORY', 'VOICE', 'CLOUD', 'RIVER', 'BRAVE'
];

export interface LetterState {
  letter: string;
  state: 'correct' | 'present' | 'absent' | 'empty';
}

const Index = () => {
  const [targetWord, setTargetWord] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [gameBoard, setGameBoard] = useState<LetterState[][]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [keyboardState, setKeyboardState] = useState<Record<string, 'correct' | 'present' | 'absent' | 'unused'>>({});
  const { toast } = useToast();

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    setTargetWord(word);
    setCurrentRow(0);
    setCurrentCol(0);
    setGameStatus('playing');
    setKeyboardState({});
    
    // Initialize empty board
    const board: LetterState[][] = [];
    for (let i = 0; i < 6; i++) {
      board[i] = [];
      for (let j = 0; j < 5; j++) {
        board[i][j] = { letter: '', state: 'empty' };
      }
    }
    setGameBoard(board);
  };

  const handleKeyPress = (key: string) => {
    if (gameStatus !== 'playing') return;

    if (key === 'ENTER') {
      handleSubmitGuess();
    } else if (key === 'BACKSPACE') {
      handleBackspace();
    } else if (key.length === 1 && /^[A-Z]$/.test(key)) {
      handleLetterInput(key);
    }
  };

  const handleLetterInput = (letter: string) => {
    if (currentCol < 5) {
      const newBoard = [...gameBoard];
      newBoard[currentRow][currentCol] = { letter, state: 'empty' };
      setGameBoard(newBoard);
      setCurrentCol(currentCol + 1);
    }
  };

  const handleBackspace = () => {
    if (currentCol > 0) {
      const newBoard = [...gameBoard];
      newBoard[currentRow][currentCol - 1] = { letter: '', state: 'empty' };
      setGameBoard(newBoard);
      setCurrentCol(currentCol - 1);
    }
  };

  const handleSubmitGuess = () => {
    if (currentCol !== 5) {
      toast({
        title: "Not enough letters",
        description: "Please enter a 5-letter word",
        variant: "destructive"
      });
      return;
    }

    const guess = gameBoard[currentRow].map(cell => cell.letter).join('');
    const newBoard = [...gameBoard];
    const newKeyboardState = { ...keyboardState };

    // Check each letter
    for (let i = 0; i < 5; i++) {
      const letter = guess[i];
      let state: 'correct' | 'present' | 'absent';

      if (targetWord[i] === letter) {
        state = 'correct';
      } else if (targetWord.includes(letter)) {
        state = 'present';
      } else {
        state = 'absent';
      }

      newBoard[currentRow][i].state = state;

      // Update keyboard state (prioritize better states)
      if (!newKeyboardState[letter] || 
          (newKeyboardState[letter] === 'absent' && state !== 'absent') ||
          (newKeyboardState[letter] === 'present' && state === 'correct')) {
        newKeyboardState[letter] = state;
      }
    }

    setGameBoard(newBoard);
    setKeyboardState(newKeyboardState);

    // Check win condition
    if (guess === targetWord) {
      setGameStatus('won');
      toast({
        title: "Congratulations! 🎉",
        description: `You guessed the word in ${currentRow + 1} attempts!`,
      });
    } else if (currentRow === 5) {
      setGameStatus('lost');
      toast({
        title: "Game Over",
        description: `The word was: ${targetWord}`,
        variant: "destructive"
      });
    } else {
      setCurrentRow(currentRow + 1);
      setCurrentCol(0);
    }
  };

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
        event.preventDefault();
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentRow, currentCol, gameStatus]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Wordle Clone</h1>
          <p className="text-muted-foreground">Guess the 5-letter word in 6 tries!</p>
        </div>

        {/* Game Board */}
        <GameBoard 
          gameBoard={gameBoard} 
          currentRow={currentRow}
          currentCol={currentCol}
        />

        {/* Game Status */}
        {gameStatus !== 'playing' && (
          <div className="text-center my-6">
            <button
              onClick={initializeGame}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Play Again
            </button>
          </div>
        )}

        {/* Keyboard */}
        <Keyboard 
          onKeyPress={handleKeyPress}
          keyboardState={keyboardState}
        />
      </div>
    </div>
  );
};

export default Index;
