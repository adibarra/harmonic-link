"use client";

import { useState } from "react";
import LoadingGame from "@/components/game/loading-game";
import Game from "@/components/game/game";
import { motion, AnimatePresence } from "motion/react";

export default function HarmonicLinks() {
  const [gameReady, setGameReady] = useState(false);
  const [startChainItem, setStartChainItem] = useState<ChainItem>();
  const [endChainItem, setEndChainItem] = useState<ChainItem>();

  const fadeInOut = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 },
  };

  if (!gameReady) {
    return (
      <motion.div {...fadeInOut}>
        <LoadingGame
          onSuccess={(start, end) => {
            setStartChainItem(start);
            setEndChainItem(end);
            setGameReady(true);
          }}
        />
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div key="game" {...fadeInOut}>
        <Game start={startChainItem!} end={endChainItem!} />
      </motion.div>
    </AnimatePresence>
  );
}
