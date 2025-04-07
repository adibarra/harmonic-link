"use client";

import { Button } from "@/components/ui/button";
import ChainDisplay from "@/components/game/chain-display";
import { Card } from "../ui/card";

interface GameOverScreenProps {
  linkChain: ChainItem[];
  onRestart: () => void;
}

const fakeLeaderboard = [
  { name: "Player1", score: 100 },
  { name: "Player2", score: 90 },
  { name: "Player3", score: 80 },
  { name: "Player4", score: 70 },
  { name: "Player5", score: 60 },
];

export default function GameOverScreen({
  linkChain,
  onRestart,
}: GameOverScreenProps) {

  const score = 42;

  return (
    <div className="flex flex-col items-center p-6 space-y-6 h-[90vh] text-white">
      <h1 className="text-4xl font-bold">Game Over</h1>
      <p className="text-xl">Your final score: {score}</p>
      <div className="flex items-center space-x-6">
        <ChainDisplay chain={linkChain} fullChain={true} />
      </div>
      <Button onClick={onRestart} className="mt-4 px-6 py-3 rounded">
        Restart Game
      </Button>
      <Card className="w-full flex flex-col">
        <h2 className="p-4 text-2xl font-bold">Leaderboard</h2>
        <ul className="rounded-lg p-4 pt-0 space-y-2">
          {fakeLeaderboard.map((entry, index) => (
            <li key={index} className="flex border-b border-white border-opacity-10">
              <span>{entry.name}</span>
              <span className="flex-1" />
              <span>{entry.score} points</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
