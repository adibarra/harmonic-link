"use client";

import { Button } from "@/components/ui/button";
import ChainDisplay from "@/components/display/chain-display";
import Leaderboard from "../display/leaderboard";
import { useState } from "react";

interface GameOverScreenProps {
  gameState: GameState;
  onRestart: () => void;
}

export default function GameOverScreen({
  gameState,
  onRestart,
}: GameOverScreenProps) {
  const max = 200;
  const min = 100;
  const score = Math.floor(Math.random() * (max - min + 1)) + min;

  const [playlistUrl, setPlaylistUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGeneratePlaylist = async () => {
    try {
      const response = await fetch("/api/playlist/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          linkChain: gameState.linkChain,
          useArtists: true, // or false if you'd prefer albums
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPlaylistUrl(data.playlistUrl);

      } else {
        setError(data.error || "Failed to create playlist");
      }
    } catch (err) {
      console.error("Game error: Unexpected error:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center p-6 space-y-6 h-[90vh] text-white">
      <h1 className="text-4xl font-bold">Game Over</h1>
      <p className="text-xl">Your final score: {score}</p>
      <div className="flex items-center space-x-6">
        <ChainDisplay chain={gameState.linkChain} fullChain={true} />
      </div>
      <Button onClick={onRestart} className="mt-4 px-6 py-3 rounded">
        {gameState.channel
          ? "Back to Lobby"
          : gameState.challenge!.type === "daily"
            ? "Swap Gamemode"
            : "New Challenge"}
      </Button>
      <Button
        variant="secondary"
        onClick={handleGeneratePlaylist}
       disabled={loading}
        className="mt-4 px-6 py-3 rounded"
      >
        Generate Playlist
        {loading ?"Generating...": "GeneratePlaylist"}
      </Button>
      {playlistUrl &&(
        <a
        href={playlistUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 underline"
        >
          Open Your Playlist on Spotify
        </a>
      )}
      <Leaderboard />
    </div>
  );
}
