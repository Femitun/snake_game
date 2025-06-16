import React from 'react';

export default function Snake({ x, y }) {
  return (
    <div
      className="snake"
      style={{ gridColumnStart: x + 1, gridRowStart: y + 1 }}
    />
  );
}