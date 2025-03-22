import React from "react";
import { Position, SnakeCell } from "../types";
import { COLORS } from "../constants";

interface GameBoardProps {
  snake: SnakeCell[];
  food: Position;
  gridWidth: number;
  gridHeight: number;
  gridSize: number;
}

const GameBoard: React.FC<GameBoardProps> = ({
  snake,
  food,
  gridWidth,
  gridHeight,
  gridSize,
}) => {
  const boardWidth = gridWidth * gridSize;
  const boardHeight = gridHeight * gridSize;

  return (
    <div
      className={`relative border-2 border-gray-300 ${COLORS.BOARD}`}
      style={{
        width: `${boardWidth}px`,
        height: `${boardHeight}px`,
      }}
    >
      {/* 渲染食物 */}
      <div
        className={`absolute rounded-full ${COLORS.FOOD}`}
        style={{
          width: `${gridSize - 2}px`,
          height: `${gridSize - 2}px`,
          left: `${food.x * gridSize + 1}px`,
          top: `${food.y * gridSize + 1}px`,
          transition: "all 0.1s",
        }}
      />

      {/* 渲染蛇 */}
      {snake.map((segment, index) => (
        <div
          key={segment.id}
          className={`absolute rounded-sm ${
            index === 0 ? COLORS.SNAKE_HEAD : COLORS.SNAKE_BODY
          }`}
          style={{
            width: `${gridSize - 2}px`,
            height: `${gridSize - 2}px`,
            left: `${segment.x * gridSize + 1}px`,
            top: `${segment.y * gridSize + 1}px`,
            transition: "all 0.1s",
            zIndex: snake.length - index,
          }}
        />
      ))}
    </div>
  );
};

export default GameBoard;
