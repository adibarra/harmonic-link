"use client";

import { useState } from "react";
import LoadingGame from "@/components/game/loading-game";
import Game from "@/components/game/game";

export default function HarmonicLinks() {
  const [gameReady, setGameReady] = useState(false);
  const [startChainItem, setStartChainItem] = useState<ChainItem>();
  const [endChainItem, setEndChainItem] = useState<ChainItem>();

  if (!gameReady) {
    return <LoadingGame onSuccess={
      (start, end) => {
        setStartChainItem(start);
        setEndChainItem(end);
        setGameReady(true);
      }} />;
  }

  return (
    <Game start={startChainItem!} end={endChainItem!} />
  );
}
