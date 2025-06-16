import React from 'react';
import Snake from './Snake';
import Food from './Food';

export default function GameBoard({ snake, food }) {
  return (
    <div className="board">
      {snake.map((seg, idx) => (
        <Snake key={idx} x={seg.x} y={seg.y} />
      ))}
      <Food x={food.x} y={food.y} />
    </div>
  );
}