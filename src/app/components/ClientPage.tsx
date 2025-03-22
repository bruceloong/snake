"use client";

import dynamic from "next/dynamic";

// 动态导入SnakeGame组件，禁用SSR，因为我们需要访问浏览器API
const SnakeGame = dynamic(() => import("./SnakeGame"), { ssr: false });

export default function ClientPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-4xl">
        <SnakeGame />

        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>使用 Next.js, React 和 Tailwind CSS 构建的贪吃蛇游戏</p>
          <p>© {new Date().getFullYear()} Snake Game</p>
        </footer>
      </div>
    </div>
  );
}
