import { useState, useEffect, useRef, useCallback } from 'react';
import { Gamepad2, Trophy, RotateCcw } from 'lucide-react';

const GRID_SIZE = 18;
const INITIAL_SNAKE = [{ x: 9, y: 14 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 140;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 9, y: 4 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const directionRef = useRef(INITIAL_DIRECTION);
  const lastProcessedDirectionRef = useRef(INITIAL_DIRECTION);

  // Generate food not on the snake
  const spawnFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    let isOnSnake = true;
    while (isOnSnake) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // eslint-disable-next-line no-loop-func
      isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    setFood(newFood!);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    directionRef.current = INITIAL_DIRECTION;
    lastProcessedDirectionRef.current = INITIAL_DIRECTION;
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    spawnFood(INITIAL_SNAKE);
    setIsGameStarted(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling around when playing
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && isGameStarted && !isGameOver) {
        setIsPaused(p => !p);
        return;
      }

      if (e.key === ' ' && (!isGameStarted || isGameOver)) {
        resetGame();
        return;
      }

      if (isPaused || isGameOver || !isGameStarted) return;

      const currentDir = lastProcessedDirectionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameStarted, isGameOver, isPaused, spawnFood]);

  useEffect(() => {
    if (!isGameStarted || isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const currentHead = prevSnake[0];
        const newDirection = directionRef.current;
        lastProcessedDirectionRef.current = newDirection;

        const newHead = {
          x: currentHead.x + newDirection.x,
          y: currentHead.y + newDirection.y
        };

        // Wall collision checking
        if (
          newHead.x < 0 || 
          newHead.x >= GRID_SIZE || 
          newHead.y < 0 || 
          newHead.y >= GRID_SIZE
        ) {
          handleGameOver();
          return prevSnake;
        }

        // Self collision checking
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food collision checking
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          spawnFood(newSnake);
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    // Increase speed slightly up to a limit
    const speed = Math.max(70, INITIAL_SPEED - Math.floor(score / 50) * 10);
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [isGameStarted, isGameOver, isPaused, food, score, spawnFood]);

  const handleGameOver = () => {
    setIsGameOver(true);
    setHighScore(h => Math.max(h, score));
  };

  return (
    <div className="flex flex-col items-center bg-slate-900 border border-cyan-500/30 p-6 rounded-xl shadow-[0_0_25px_theme(colors.cyan.500/20)] relative overflow-hidden backdrop-blur-md w-full max-w-md">
      {/* Decorative neon header line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-cyan-500 to-blue-500 shadow-[0_0_10px_theme(colors.cyan.400)]" />

      {/* Header Panel */}
      <div className="flex justify-between items-center w-full mb-6">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
            <Trophy size={14} className="text-pink-500" /> Score
          </span>
          <span className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_8px_theme(colors.cyan.400/50)]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs uppercase tracking-[0.2em] text-slate-400">High Score</span>
          <span className="text-xl font-bold text-pink-500 drop-shadow-[0_0_8px_theme(colors.pink.500/50)]">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Game Board Container */}
      <div 
        className="w-full aspect-square relative bg-slate-950 border-2 border-slate-800 rounded-sm shadow-inner overflow-hidden"
        style={{ 
          backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`, // Add faint grid lines
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)'
        }}
      >
        {/* Render Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute rounded-sm ${index === 0 ? 'bg-green-400 shadow-[0_0_12px_theme(colors.green.400)] z-10 z-[2]' : 'bg-green-600/80'}`}
            style={{
              left: `${(segment.x / GRID_SIZE) * 100}%`,
              top: `${(segment.y / GRID_SIZE) * 100}%`,
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              transform: 'scale(0.9)', // Creates slight gap between segments
            }}
          />
        ))}

        {/* Render Food */}
        <div
          className="absolute bg-pink-500 rounded-full shadow-[0_0_15px_theme(colors.pink.500)] animate-pulse z-[1]"
          style={{
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            transform: 'scale(0.8)',
          }}
        />

        {/* Overlays */}
        {!isGameStarted && !isGameOver && (
          <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
            <Gamepad2 size={48} className="text-cyan-400 mb-4 drop-shadow-[0_0_10px_theme(colors.cyan.400)]" />
            <button 
              onClick={resetGame}
              className="px-6 py-3 bg-cyan-500/20 text-cyan-400 border border-cyan-400 rounded-md uppercase tracking-wider font-bold hover:bg-cyan-500/40 hover:shadow-[0_0_15px_theme(colors.cyan.400)] transition-all pointer-events-auto"
            >
              Start Game
            </button>
            <p className="text-slate-400 text-xs mt-4 uppercase tracking-[0.2em] font-mono select-none">
              Press SPACE to start
            </p>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-red-950/90 flex flex-col items-center justify-center z-20 backdrop-blur-md">
            <h2 className="text-4xl font-bold text-red-500 mb-2 drop-shadow-[0_0_15px_theme(colors.red.500)] uppercase tracking-widest">
              Game Over
            </h2>
            <p className="text-slate-300 mb-8 tracking-[0.2em] text-sm">Final Score: {score}</p>
            <button 
              onClick={resetGame}
              className="px-6 py-3 bg-pink-500/20 text-pink-400 border border-pink-400 rounded-md uppercase tracking-wider font-bold hover:bg-pink-500/40 hover:shadow-[0_0_15px_theme(colors.pink.400)] transition-all flex items-center gap-2"
            >
              <RotateCcw size={18} /> Play Again
            </button>
          </div>
        )}

        {isPaused && !isGameOver && isGameStarted && (
          <div className="absolute inset-0 bg-slate-950/50 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
             <h2 className="text-2xl font-bold text-cyan-400 mb-2 drop-shadow-[0_0_10px_theme(colors.cyan.400)] uppercase tracking-widest">
              Paused
            </h2>
            <p className="text-slate-400 text-xs mt-2 uppercase tracking-[0.2em] font-mono">
              Press SPACE to resume
            </p>
          </div>
        )}
      </div>
      
      {/* Footer Instructions */}
      <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-500 uppercase tracking-widest w-full">
        <span className="flex items-center gap-1">
          <span className="bg-slate-800 px-2 py-1 rounded text-slate-300 border border-slate-700">W A S D</span> or Arrows to move
        </span>
        <span className="flex items-center gap-1">
          <span className="bg-slate-800 px-2 py-1 rounded text-slate-300 border border-slate-700">SPACE</span> to pause
        </span>
      </div>
    </div>
  );
}
