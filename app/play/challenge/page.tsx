"use client";

import { useEffect, useState, useCallback } from "react";
import GameLoading from "@/components/game/game-loading";
import GamePage from "@/components/game/game";
import GameOver from "@/components/game/game-over";
import { motion, AnimatePresence } from "motion/react";
import { fetchDaily } from "@/services/fetchDaily";
import { fetchDailyPar } from "@/services/fetchDailyPar";

const MIN_LOADING_TIME = 2000;
const SUCCESS_DISPLAY_TIME = 6000;

export default function ChallengeGame() {
  const [gameState, setGameState] = useState<"loading" | "ready" | "game-over">("loading");
  const [linkChain, setLinkChain] = useState<ChainItem[]>([]);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [par, setPar] = useState<number>(0);

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
      const [Lpar] = await Promise.all([
        fetchDailyPar(),
        new Promise((resolve) => setTimeout(resolve, MIN_LOADING_TIME)),
      ]);

      if (!Lpar || Lpar < 1) {
        throw new Error("Invalid challenge data received");
      }
      setPar(Lpar);

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
    <>
      {gameState === "loading" && (
        <motion.div key="loading" {...fadeInOut}>
          <GameLoading
            start={linkChain[0]}
            end={linkChain[1]}
            par={par}
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
        <AnimatePresence>
          <motion.div key="game" {...fadeInOut}>
            <GamePage
              linkChain={linkChain}
              par={par}
              setLinkChain={setLinkChain}
              onGameOver={handleGameOver}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}
