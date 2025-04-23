"use client";
import { fetchLeaderboard } from "@/services/fetchLeaderboard";
import { Card } from "../ui/card";
import { useEffect, useState } from "react";

const fakeLeaderboard: LeaderboardEntry[] = [
  { name: "Player1", score: 100 },
  { name: "Player2", score: 90 },
  { name: "Player3", score: 80 },
  { name: "Player4", score: 70 },
  { name: "Player5", score: 60 },
];

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState(fakeLeaderboard);

  useEffect(() => {
    console.log("This is the useeffect being triggered");
    const loadLeaderboard = async () => {
      const fetchedLeaderboard = await fetchLeaderboard();
      if (!fetchedLeaderboard) {
        console.log("failed to fetch leaderboard");
        return;
      }
      console.log("fetched leaderboard", fetchedLeaderboard);
      setLeaderboard(fetchedLeaderboard);
    };
    loadLeaderboard();
  }, []);

  return (
    <Card className="w-full flex flex-col">
      <h2 className="p-4 text-2xl font-bold">Leaderboard</h2>
      <ul className="rounded-lg p-4 pt-0 space-y-2">
        {leaderboard.map((entry, index) => (
          <li
            key={index}
            className="flex border-b border-white border-opacity-10"
          >
            <span>{entry.name}</span>
            <span className="flex-1" />
            <span>{entry.score} points</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
