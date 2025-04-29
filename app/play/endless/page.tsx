"use client";

import { useEffect, useState, useCallback } from "react";
import GameLoading from "@/components/game/game-loading";
import GamePage from "@/components/game/game";
import GameOver from "@/components/game/game-over";
import { motion } from "motion/react";
import { fetchArtistArtist } from "@/services/fetchArtistArtist";

const MIN_LOADING_TIME = 2000;
const SUCCESS_DISPLAY_TIME = 3500;

export default function ChallengeGame() {
  const [gameState, setGameState] = useState<GameState>({
    challenge: null,
    channel: null,
    status: "waiting",
    linkChain: [],
  });
  const [loadingError, setLoadingError] = useState<string | null>(null);

  const loadChallenge = useCallback(async () => {
    try {
      setLoadingError(null);
      setGameState((prevState) => ({
        ...prevState,
        status: "loading",
      }));

      const [challenge] = await Promise.all([
        fetchArtistArtist(),
        new Promise((resolve) => setTimeout(resolve, MIN_LOADING_TIME)),
      ]);

      if (!challenge) {
        throw new Error("Invalid challenge data received");
      }

      setGameState((prevState) => ({
        ...prevState,
        challenge,
        linkChain: [challenge.start, challenge.end],
      }));

      setTimeout(() => {
        setGameState((prevState) => ({
          ...prevState,
          status: "playing",
        }));
      }, SUCCESS_DISPLAY_TIME);
    } catch (err) {
      console.error("Challenge load error:", err);
      setLoadingError(
        err instanceof Error ? err.message : "Failed to load daily challenge"
      );
    }
  }, []);

  const handleRestart = useCallback(() => {
    setLoadingError(null);
    setGameState((prevState) => ({
      ...prevState,
      status: "waiting",
      linkChain: [],
      challenge: null,
    }));
  }, []);

  const handleGameOver = useCallback(() => {
    setGameState((prevState) => ({
      ...prevState,
      status: "finished",
    }));
  }, []);

  useEffect(() => {
    if (gameState.status === "waiting") {
      loadChallenge();
    }
  }, [gameState.status, loadChallenge]);

  const fadeInOut = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <>
      {gameState.status === "loading" && (
        <motion.div key="loading" {...fadeInOut}>
          <GameLoading
            challenge={gameState.challenge}
            error={loadingError}
            loadingMessage="Generating a new random challenge..."
            successMessage="Found a new path. Get ready!"
          />
        </motion.div>
      )}

      {gameState.status === "finished" && (
        <motion.div key="finished" {...fadeInOut}>
          <GameOver
            gameState={gameState}
            onRestart={handleRestart}
          />
        </motion.div>
      )}

      {gameState.status === "playing" && (
        <motion.div key="playing" {...fadeInOut}>
          <GamePage
            gameState={gameState}
            setGameState={setGameState}
            onGameOver={handleGameOver}
          />
        </motion.div>
      )}
    </>
  );
}
