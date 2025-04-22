"use client"

import { useEffect, useState, useCallback } from "react";
import GameLoading from "@/components/game/game-loading";
import GamePage from "@/components/game/game";
import GameOver from "@/components/game/game-over";
import { motion, AnimatePresence } from "framer-motion";
import { fetchArtistArtist } from "@/services/fetchArtistArtist";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

const MIN_LOADING_TIME = 2000;
const SUCCESS_DISPLAY_TIME = 6000;

export default function ChallengeGame() {
  const [gameState, setGameState] = useState<"loading" | "ready" | "game-over">("loading");
  const [linkChain, setLinkChain] = useState<ChainItem[]>([]);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const { channel } = useParams();
  const [isHost, setIsHost] = useState(false);
  const [broadcastChannel, setBroadcastChannel] = useState<any>(null);


  useEffect(() => {
    if (!channel) return;

    const channelInstance = supabase.channel(`game-channel:${channel}`);

    channelInstance
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channelInstance.presenceState();
        const users = Object.values(presenceState).map((user: any) => user[0]);


        if (users.length === 1) {
          setIsHost(true);
        }
      })
      .on('broadcast', { event: 'challenge_loaded' }, ({ payload }) => {
        setLinkChain(payload.linkChain);
        setGameState("ready");
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channelInstance.track({});
        }
      });

    setBroadcastChannel(channelInstance);

    return () => {
      channelInstance.unsubscribe();
    };
  }, [channel]);

  const loadChallenge = useCallback(async () => {
    if (!isHost) return;

    try {
      setLoadingError(null);
      const [data] = await Promise.all([
        fetchArtistArtist('alternative'),
        new Promise((resolve) => setTimeout(resolve, MIN_LOADING_TIME)),
      ]);

      if (!data || data.length < 2) {
        throw new Error("Invalid challenge data received");
      }

      const [start, end] = data;
      const newLinkChain = [start, end];
      setLinkChain(newLinkChain);


      broadcastChannel?.send({
        type: 'broadcast',
        event: 'challenge_loaded',
        payload: { linkChain: newLinkChain },
      });

      await new Promise((resolve) => setTimeout(resolve, SUCCESS_DISPLAY_TIME));
      setGameState("ready");
    } catch (err) {
      console.error("Challenge load error:", err);
      setLoadingError(
        err instanceof Error ? err.message : "Failed to load new challenge"
      );
    }
  }, [isHost, broadcastChannel]);

  const handleRestart = useCallback(() => {
    setGameState("loading");
    setLinkChain([]);
    setLoadingError(null);

    if (isHost) {
      loadChallenge();
    }
  }, [isHost, loadChallenge]);

  const handleGameOver = useCallback(() => {
    setGameState("game-over");
  }, []);

  useEffect(() => {
    if (gameState === "loading" && isHost) {
      loadChallenge();
    }
  }, [gameState, isHost, loadChallenge]);

  const fadeInOut = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <AnimatePresence mode="wait">
      {gameState === "loading" && (
        <motion.div key="loading" {...fadeInOut}>
          <GameLoading
            start={linkChain[0]}
            end={linkChain[1]}
            isLoading={!loadingError && !linkChain.length}
            error={loadingError}
            description="This may take a few seconds."
            loadingMessage="Generating a new random challenge..."
            successMessage="Found a new path. Get ready!"
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
            channel={channel as string | undefined}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
