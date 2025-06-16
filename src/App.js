import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './components/GameBoard';

const WIDTH = 20;
const HEIGHT = 20;
const INITIAL_SNAKE = [{ x: 9, y: 9 }];
const INITIAL_SPEED = 200;

function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [speed] = useState(INITIAL_SPEED);
  const [gameOver, setGameOver] = useState(false);

  // Helper to restart everything
  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection({ x: 1, y: 0 });
    setFood({
      x: Math.floor(Math.random() * WIDTH),
      y: Math.floor(Math.random() * HEIGHT),
    });
    setGameOver(false);
  }, []);

  // Keydown listener: always active, for both direction and restart
  const handleKeyDown = useCallback((e) => {
    if (gameOver) {
      // Space (by code) restarts
      if (e.code === 'Space') {
        resetGame();
      }
      return;
    }

    // Only handle arrows when game is running
    let newDir = null;
    if (e.key === 'ArrowUp') newDir = { x: 0, y: -1 };
    if (e.key === 'ArrowDown') newDir = { x: 0, y: 1 };
    if (e.key === 'ArrowLeft') newDir = { x: -1, y: 0 };
    if (e.key === 'ArrowRight') newDir = { x: 1, y: 0 };
    if (newDir) {
      // Prevent reversing into yourself
      if (
        snake.length > 1 &&
        newDir.x === -direction.x &&
        newDir.y === -direction.y
      ) {
        return;
      }
      setDirection(newDir);
    }
  }, [gameOver, resetGame, snake, direction]);

  // Mount the keydown listener once
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Game loop: only runs while gameOver is false
  useEffect(() => {
    if (gameOver) return;

    const timer = setInterval(() => {
      setSnake(prev => {
        const head = { x: prev[0].x + direction.x, y: prev[0].y + direction.y };

        // Check wall or self-collision
        if (
          head.x < 0 || head.x >= WIDTH ||
          head.y < 0 || head.y >= HEIGHT ||
          prev.some(seg => seg.x === head.x && seg.y === head.y)
        ) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [head, ...prev];

        // If food eaten, place new food; else pop tail
        if (head.x === food.x && head.y === food.y) {
          setFood({
            x: Math.floor(Math.random() * WIDTH),
            y: Math.floor(Math.random() * HEIGHT),
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [direction, food, gameOver, speed]);

  return (
    <div style={{ position: 'relative' }}>
      <GameBoard snake={snake} food={food} />
      {gameOver && (
        <div className="game-over">
          Game Over<br/>
          <small>(Press Space to restart)</small>
        </div>
      )}
    </div>
  );
}

export default App;
