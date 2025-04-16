"use client";

import { useState } from "react";
import GameLoading from "@/components/game/game-loading";
import GamePage from "@/components/game/game-mp";
import GameOver from "@/components/game/game-over";
import { motion, AnimatePresence } from "motion/react";

export default function MultiplayerGame() {
  const [gameReady, setGameReady] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [linkChain, setLinkChain] = useState<ChainItem[]>([]);

  const fadeInOut = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 },
  };

  if (!gameReady) {
    return (
      <motion.div {...fadeInOut}>
        <GameLoading
          onSuccess={(start, end) => {
            setLinkChain([start, end]);
            setGameReady(true);
          }}
        />
      </motion.div>
    );
  }

  if (gameOver) {
    return (
      <motion.div {...fadeInOut}>
        <GameOver
          linkChain={linkChain}
          onRestart={() => {
            setGameOver(false);
            setGameReady(false);
          }}
        />
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div key="multiplayer-game" {...fadeInOut}>
        <GamePage
          linkChain={linkChain}
          setLinkChain={setLinkChain}
          onGameOver={() => {
            setGameOver(true);
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
