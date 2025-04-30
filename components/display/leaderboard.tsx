"use client";
import { fetchGames } from "@/services/fetchGames";
import { Card } from "../ui/card";
import { useEffect, useState } from "react";

interface LeaderboardProps {
  gameId: number;
  gameMode: string;
}

export default function Leaderboard({ gameId, gameMode }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const getLeaderboardFromGames = (games: LeaderboardEntry[]) => {
      const topEntires = games
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
        .map((entry) => ({
          userId: entry.userId || "guest",
          ...entry,
        }));
      return topEntires;
    };

    const loadLeaderboard = async () => {
      const fetchedGames = await fetchGames(gameId, gameMode);
      if (!fetchedGames) {
        console.log("failed to fetch games for leaderboard");
        return;
      }
      const newLeaderboard = getLeaderboardFromGames(fetchedGames);
      setLeaderboard(newLeaderboard);
    };

    loadLeaderboard();
  }, []);

  return (
    <Card className="w-full flex flex-col">
      <h2 className="p-4 text-2xl font-bold">Leaderboard</h2>
      <ul className="rounded-lg p-4 pt-0 space-y-2">
        {leaderboard.length === 0 ? (
          <div>No leaderboard entries</div>
        ) : (
          leaderboard.map((entry, index) => (
            <li
              key={index}
              className="flex border-b border-white border-opacity-10"
            >
              <span>{entry.userId}</span>
              <span className="flex-1" />
              <span>{entry.score} points</span>
            </li>
          ))
        )}
      </ul>
    </Card>
  );
}
