"use client";

import { Button } from "@/components/ui/button";
import ChainDisplay from "@/components/display/chain-display";
import Leaderboard from "../display/leaderboard";
import { useState } from "react";
import {
  ArrowLeftToLineIcon,
  ListPlusIcon,
  LogOutIcon,
  RefreshCwIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface GameOverScreenProps {
  gameState: GameState;
  onRestart: () => void;
}

export default function GameOverScreen({
  gameState,
  onRestart,
}: GameOverScreenProps) {
  const router = useRouter();
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [playlistLoading, setPlaylistLoading] = useState(false);
  const [playlistError, setPlaylistError] = useState("");

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
        setPlaylistError(data.error || "Failed to create playlist");
      }
    } catch (err) {
      console.error("Game error: Unexpected error:", err);
      setPlaylistError("Something went wrong.");
    } finally {
      setPlaylistLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-6 h-[90vh] text-white">
      <h1 className="text-4xl font-bold">Game Over</h1>
      <p className="text-xl">Your final score: {gameState.score}</p>
      <div className="flex items-center space-x-6">
        <ChainDisplay chain={gameState.linkChain} fullChain={true} />
      </div>
      <div className="flex items-center space-x-6">
        <Button
          className="w-fit flex-row gap-2 justify-center items-center"
          variant="secondary"
          onClick={handleGeneratePlaylist}
          disabled={playlistLoading}
        >
          <ListPlusIcon className="w-5 h-5" />
          {playlistLoading ? "Generating..." : "Generate Playlist"}
        </Button>
        {gameState.channel ? (
          <>
            <Button
              className="w-fit flex-row gap-2 justify-center items-center"
              variant="secondary"
              onClick={onRestart}
            >
              <ArrowLeftToLineIcon className="w-5 h-5" />
              Back to Lobby
            </Button>
            <Button
              className="w-fit flex-row gap-2 justify-center items-center"
              variant="destructive"
              onClick={() => {
                router.push(`/play`);
              }}
            >
              <LogOutIcon className="w-5 h-5" />
              Leave Lobby
            </Button>
          </>
        ) : gameState.challenge!.type === "daily" ? (
          <Button
            className="w-fit flex-row gap-2 justify-center items-center"
            variant="destructive"
            onClick={onRestart}
          >
            <LogOutIcon className="w-5 h-5" />
            End Challenge
          </Button>
        ) : (
          <Button
            className="w-fit flex-row gap-2 justify-center items-center"
            variant="secondary"
            onClick={onRestart}
          >
            <RefreshCwIcon className="w-5 h-5" />
            New Challenge
          </Button>
        )}
      </div>
      {playlistUrl && (
        <a
          href={playlistUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline"
        >
          Open Your Playlist on Spotify
        </a>
      )}
      {playlistError && <p className="text-red-500">{playlistError}</p>}
      {gameState.challenge && gameState.gameId && (
        <Leaderboard
          gameId={gameState.gameId}
          gameMode={gameState.challenge?.type}
        />
      )}
    </div>
  );
}
