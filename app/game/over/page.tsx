"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GameOverScreen from "@/components/game/game-over";

interface Artist {
  id: string;
  name: string;
  image: string;
}

interface Album {
  id: string;
  name: string;
  artist: string;
  image: string;
}

export default function GameOverPage() {
  const [gameOver, setGameOver] = useState(true);
  const router = useRouter();

  const startArtist: Artist = {
    id: "1",
    name: "Imagine Dragons",
    image: "https://i.scdn.co/image/ab67616100005174ab47d8dae2b24f5afe7f9d38",
  };

  const endArtist: Artist = {
    id: "2",
    name: "Taylor Swift",
    image: "https://i.scdn.co/image/ab67616100005174e672b5f553298dcdccb0e676",
  };

  const linkChain: Album[] = [
    {
      id: "a1",
      name: "LOOM",
      artist: "Imagine Dragons",
      image: "https://placehold.co/150/png",
    },
    {
      id: "a2",
      name: "Loosing",
      artist: "Groove Chorus",
      image: "https://placehold.co/150/png",
    },
    {
      id: "a3",
      name: "Am I Still Dreaming?",
      artist: "Loose Room",
      image: "https://placehold.co/150/png",
    },
  ];

  const score = 42;

  const handleRestart = () => {
    console.log("Restarting game...");
    setGameOver(false);
    router.replace("/game/loading");
  };

  return (
    <GameOverScreen
      startArtist={startArtist}
      endArtist={endArtist}
      linkChain={linkChain}
      score={score}
      onRestart={handleRestart}
    />
  );
}
