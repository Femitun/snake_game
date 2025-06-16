import React from 'react';

export default function Food({ x, y }) {
  return (
    <div
      className="food"
      style={{ gridColumnStart: x + 1, gridRowStart: y + 1 }}
    />
  );
}