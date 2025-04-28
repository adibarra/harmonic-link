"use client"

import { useEffect, useState, useCallback } from "react";
import GameLoading from "@/components/game/game-loading";
import GamePage from "@/components/game/game";
import GameOver from "@/components/game/game-over";
import { motion } from "motion/react";
import { fetchArtistArtist } from "@/services/fetchArtistArtist";
import { useParams, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

const MIN_LOADING_TIME = 2000;
const SUCCESS_DISPLAY_TIME = 6000;

export default function ChallengeGame() {
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [broadcastChannel, setBroadcastChannel] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    challenge: null,
    channel: useParams().channel as string || null,
    status: "waiting",
    linkChain: [],
  });
  const isHost = useSearchParams().get("isHost") === "true";

  useEffect(() => {
    if (!gameState.channel) return;

    const channelInstance = supabase.channel(`game-channel:${gameState.channel}`);
    channelInstance
      .on('broadcast', { event: 'challenge_loaded' }, ({ payload }) => {
        const challenge: Challenge = JSON.parse(payload.challenge);
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
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channelInstance.track({});
          setIsConnected(true);
        }
      });

    setBroadcastChannel(channelInstance);

    return () => {
      channelInstance.unsubscribe();
    };
  }, [gameState.channel]);

  const loadChallenge = useCallback(async () => {
    setLoadingError(null);
    setGameState((prevState) => ({
      ...prevState,
      status: "loading",
    }));

    if (!isHost) return;
    try {
      const [challenge] = await Promise.all([
        fetchArtistArtist(),
        new Promise((resolve) => setTimeout(resolve, MIN_LOADING_TIME)),
      ]);

      if (!challenge) {
        throw new Error("Invalid challenge data received");
      }

      broadcastChannel?.send({
        type: 'broadcast',
        event: 'challenge_loaded',
        payload: { challenge: JSON.stringify(challenge) },
      });

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
  }, [isHost, broadcastChannel]);

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
    if (isConnected && gameState.status === "waiting") {
      loadChallenge();
    }
  }, [gameState.status, loadChallenge, isConnected]);

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
