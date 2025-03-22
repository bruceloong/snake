"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Direction, GameState, Position, SnakeCell } from "../types";
import {
  GRID_SIZE,
  GRID_HEIGHT,
  GRID_WIDTH,
  GAME_SPEED_NORMAL,
} from "../constants";
import GameBoard from "./GameBoard";
import GameControls from "./GameControls";

// 生成随机食物位置
const generateFood = (snake: SnakeCell[]): Position => {
  let newFood: Position;
  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_WIDTH),
      y: Math.floor(Math.random() * GRID_HEIGHT),
    };
    // 确保食物不会出现在蛇身上
  } while (
    snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)
  );

  return newFood;
};

// 初始游戏状态
const initialGameState: GameState = {
  snake: [
    { id: 2, x: 3, y: 5 },
    { id: 1, x: 2, y: 5 },
    { id: 0, x: 1, y: 5 },
  ],
  food: { x: 10, y: 10 },
  direction: Direction.RIGHT,
  nextDirection: Direction.RIGHT,
  gameOver: false,
  score: 0,
  isPaused: false,
};

const SnakeGame = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialState = { ...initialGameState };
    initialState.food = generateFood(initialState.snake);
    return initialState;
  });

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  // 重置游戏
  const resetGame = useCallback(() => {
    setGameState(() => {
      const newState = { ...initialGameState };
      newState.food = generateFood(newState.snake);
      return newState;
    });
  }, []);

  // 暂停/继续游戏
  const togglePause = useCallback(() => {
    setGameState((prevState) => ({
      ...prevState,
      isPaused: !prevState.isPaused,
    }));
  }, []);

  // 处理方向变化
  const handleDirectionChange = useCallback((newDirection: Direction) => {
    setGameState((prevState) => {
      // 防止180度转弯（蛇不能立即反向移动）
      if (
        (prevState.direction === Direction.UP &&
          newDirection === Direction.DOWN) ||
        (prevState.direction === Direction.DOWN &&
          newDirection === Direction.UP) ||
        (prevState.direction === Direction.LEFT &&
          newDirection === Direction.RIGHT) ||
        (prevState.direction === Direction.RIGHT &&
          newDirection === Direction.LEFT)
      ) {
        return prevState;
      }

      return {
        ...prevState,
        nextDirection: newDirection,
      };
    });
  }, []);

  // 更新游戏状态
  const updateGameState = useCallback(() => {
    setGameState((prevState) => {
      if (prevState.gameOver || prevState.isPaused) {
        return prevState;
      }

      const { snake, food, nextDirection, score } = prevState;

      // 移动蛇头
      const head = snake[0];
      const newHead: SnakeCell = { ...head, id: head.id + 1 };

      switch (nextDirection) {
        case Direction.UP:
          newHead.y = (newHead.y - 1 + GRID_HEIGHT) % GRID_HEIGHT;
          break;
        case Direction.DOWN:
          newHead.y = (newHead.y + 1) % GRID_HEIGHT;
          break;
        case Direction.LEFT:
          newHead.x = (newHead.x - 1 + GRID_WIDTH) % GRID_WIDTH;
          break;
        case Direction.RIGHT:
          newHead.x = (newHead.x + 1) % GRID_WIDTH;
          break;
      }

      // 检查是否撞到自己
      if (
        snake.some(
          (segment) => segment.x === newHead.x && segment.y === newHead.y
        )
      ) {
        return { ...prevState, gameOver: true };
      }

      // 创建新的蛇身
      const newSnake = [newHead, ...snake];

      // 检查是否吃到食物
      let newFood = food;
      let newScore = score;

      if (newHead.x === food.x && newHead.y === food.y) {
        // 吃到食物，增加分数，不移除尾部
        newScore += 10;
        newFood = generateFood(newSnake);
      } else {
        // 没吃到食物，移除尾部
        newSnake.pop();
      }

      return {
        ...prevState,
        snake: newSnake,
        food: newFood,
        score: newScore,
        direction: nextDirection,
      };
    });
  }, []);

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          handleDirectionChange(Direction.UP);
          break;
        case "ArrowDown":
          handleDirectionChange(Direction.DOWN);
          break;
        case "ArrowLeft":
          handleDirectionChange(Direction.LEFT);
          break;
        case "ArrowRight":
          handleDirectionChange(Direction.RIGHT);
          break;
        case " ":
          // 空格键暂停/继续
          togglePause();
          break;
        case "r":
        case "R":
          // R键重置游戏
          resetGame();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleDirectionChange, resetGame, togglePause]);

  // 游戏循环
  useEffect(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }

    gameLoopRef.current = setInterval(() => {
      updateGameState();
    }, GAME_SPEED_NORMAL);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [updateGameState]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold my-4">贪吃蛇游戏</h1>

      <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4 flex justify-between w-full">
          <span className="text-xl font-semibold">分数: {gameState.score}</span>
          <div>
            {gameState.gameOver && (
              <span className="text-red-500 font-bold mr-4">游戏结束!</span>
            )}
            {gameState.isPaused && !gameState.gameOver && (
              <span className="text-yellow-500 font-bold mr-4">已暂停</span>
            )}
          </div>
        </div>

        <GameBoard
          snake={gameState.snake}
          food={gameState.food}
          gridWidth={GRID_WIDTH}
          gridHeight={GRID_HEIGHT}
          gridSize={GRID_SIZE}
        />

        <GameControls
          onDirectionChange={handleDirectionChange}
          onReset={resetGame}
          onTogglePause={togglePause}
          isPaused={gameState.isPaused}
          gameOver={gameState.gameOver}
        />

        <div className="mt-4 text-sm text-gray-500">
          <p>使用方向键或按钮控制蛇的移动</p>
          <p>空格键暂停/继续游戏, R键重置游戏</p>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
