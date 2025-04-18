"use client";

import { Button } from "@/components/ui/button";
import ChainDisplay from "@/components/display/chain-display";
import { Card } from "../ui/card";
import { useEffect } from "react";

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
  useEffect(() => {
    console.log("First linkChain item:", linkChain[0]);
  }, [linkChain]);

  const handleGeneratePlaylist = async () => {
    try {
      const response = await fetch("/api/playlist/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          linkChain,
          useArtists: true, // or false if you'd prefer albums
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to create playlist:", data.error);
        alert("Error creating playlist: " + data.error);
        return;
      }
    }
    catch (error: any) {
      console.error("Error creating playlist:", error);
      alert("Error creating playlist: " + error.message);
    }
  };
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
      <Button
        variant="secondary"
        onClick={handleGeneratePlaylist}
        className="mt-4 px-6 py-3 rounded"
      >
        Generate Playlist
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
