import React from "react";
import { Direction } from "../types";

interface GameControlsProps {
  onDirectionChange: (direction: Direction) => void;
  onReset: () => void;
  onTogglePause: () => void;
  isPaused: boolean;
  gameOver: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onDirectionChange,
  onReset,
  onTogglePause,
  isPaused,
  gameOver,
}) => {
  // 控制按钮样式
  const buttonStyle =
    "w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 active:bg-blue-700 focus:outline-none";
  const actionButtonStyle = "px-4 py-2 rounded-md focus:outline-none";

  return (
    <div className="mt-6">
      {/* 游戏操作按钮 */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          className={`${actionButtonStyle} ${
            gameOver
              ? "bg-green-500 hover:bg-green-600"
              : "bg-yellow-500 hover:bg-yellow-600"
          }`}
          onClick={gameOver ? onReset : onTogglePause}
        >
          {gameOver ? "重新开始" : isPaused ? "继续" : "暂停"}
        </button>

        {!gameOver && (
          <button
            className={`${actionButtonStyle} bg-gray-500 hover:bg-gray-600`}
            onClick={onReset}
          >
            重置
          </button>
        )}
      </div>

      {/* 方向控制器 */}
      <div className="grid grid-cols-3 gap-2 w-44 mx-auto">
        {/* 上方向按钮，位于第一行第二列 */}
        <div className="col-start-2">
          <button
            className={buttonStyle}
            onClick={() => onDirectionChange(Direction.UP)}
            aria-label="Move Up"
          >
            ↑
          </button>
        </div>

        {/* 左、右方向按钮，位于第二行 */}
        <div className="flex justify-between col-span-3">
          <button
            className={buttonStyle}
            onClick={() => onDirectionChange(Direction.LEFT)}
            aria-label="Move Left"
          >
            ←
          </button>
          <div className="w-12 h-12"></div> {/* 中间空白 */}
          <button
            className={buttonStyle}
            onClick={() => onDirectionChange(Direction.RIGHT)}
            aria-label="Move Right"
          >
            →
          </button>
        </div>

        {/* 下方向按钮，位于第三行第二列 */}
        <div className="col-start-2">
          <button
            className={buttonStyle}
            onClick={() => onDirectionChange(Direction.DOWN)}
            aria-label="Move Down"
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameControls;
