"use client";

import { useEffect, useState, useCallback } from "react";
import GameLoading from "@/components/game/game-loading";
import GamePage from "@/components/game/game";
import GameOver from "@/components/game/game-over";
import { motion, AnimatePresence } from "framer-motion";
import { fetchDaily } from "@/services/fetchDaily";

const MIN_LOADING_TIME = 2000;
const SUCCESS_DISPLAY_TIME = 6000;

export default function ChallengeGame() {
  const [gameState, setGameState] = useState<
    "loading" | "ready" | "game-over"
  >("loading");
  const [linkChain, setLinkChain] = useState<ChainItem[]>([]);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  const loadChallenge = useCallback(async () => {
    try {
      setLoadingError(null);
      const [data] = await Promise.all([
        fetchDaily(),
        new Promise((resolve) => setTimeout(resolve, MIN_LOADING_TIME)),
      ]);

      if (!data || data.length < 2) {
        throw new Error("Invalid challenge data received");
      }

      const [start, end] = data;
      setLinkChain([start, end]);

      await new Promise((resolve) => setTimeout(resolve, SUCCESS_DISPLAY_TIME));
      setGameState("ready");
    } catch (err) {
      console.error("Challenge load error:", err);
      setLoadingError(
        err instanceof Error ? err.message : "Failed to load daily challenge"
      );
    }
  }, []);

  const handleRestart = useCallback(() => {
    setGameState("loading");
    setLinkChain([]);
    setLoadingError(null);
  }, []);

  const handleGameOver = useCallback(() => {
    setGameState("game-over");
  }, []);

  useEffect(() => {
    if (gameState === "loading") {
      loadChallenge();
    }
  }, [gameState, loadChallenge]);

  const fadeInOut = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <AnimatePresence>
      {gameState === "loading" && (
        <motion.div key="loading" {...fadeInOut}>
          <GameLoading
            start={linkChain[0]}
            end={linkChain[1]}
            isLoading={!loadingError && !linkChain.length}
            error={loadingError}
            description=""
            loadingMessage="Getting today's daily challenge ready..."
            successMessage="Found today's challenge. Get ready!"
          />
        </motion.div>
      )}

      {gameState === "game-over" && (
        <motion.div key="game-over" {...fadeInOut}>
          <GameOver
            linkChain={linkChain}
            onRestart={handleRestart}
          />
        </motion.div>
      )}

      {gameState === "ready" && (
        <motion.div key="game" {...fadeInOut}>
          <GamePage
            linkChain={linkChain}
            setLinkChain={setLinkChain}
            onGameOver={handleGameOver}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
