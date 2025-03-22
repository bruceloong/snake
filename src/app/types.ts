// 方向枚举
export enum Direction {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

// 坐标类型
export interface Position {
  x: number;
  y: number;
}

// 蛇的单元格类型
export interface SnakeCell extends Position {
  id: number;
}

// 游戏状态类型
export interface GameState {
  snake: SnakeCell[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  gameOver: boolean;
  score: number;
  isPaused: boolean;
}
