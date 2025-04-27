"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MoonLoader } from "react-spinners";
import ArtistCard from "@/components/display/artist-card";

interface LoadingGameProps {
  start?: ChainItem;
  end?: ChainItem;
  par?: number;
  loadingMessage?: string;
  successMessage?: string;
  title?: string;
  description?: string | React.ReactNode;
  isLoading?: boolean;
  error?: string | null;
}

export default function LoadingGame({
  start,
  end,
  par,
  loadingMessage = "Finding two artists to connect through their music...",
  successMessage = "Found a path. Get ready!",
  title = "Harmonic Links",
  description = "This may take a few seconds.",
  isLoading = true,
  error = null,
}: LoadingGameProps) {
  const messages = [
    "Tuning instruments...",
    "Syncing BPMs...",
    "Spinning vinyls...",
    "Reconstructing remixes...",
    "Diving into sample archives...",
    "Cross-referencing liner notes...",
    "Tracing hidden collaborations...",
    "Following producer fingerprints...",
    "Letting the algorithm jam...",
    "Rewinding cassette tapes...",
  ];

  const [currentMessage, setCurrentMessage] = useState(messages[0]);
  const [showArtists, setShowArtists] = useState(false);

  useEffect(() => {
    const shuffledMessages = [...messages].sort(() => Math.random() - 0.5);
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => {
        const nextIndex = (shuffledMessages.indexOf(prev) + 1) % shuffledMessages.length;
        return shuffledMessages[nextIndex];
      });
    }, 3000);

    if (!isLoading && !error) {
      setCurrentMessage(successMessage);
      setShowArtists(true);
      clearInterval(messageInterval);
    }

    return () => clearInterval(messageInterval);
  }, [isLoading, error, successMessage]);

  const success = !isLoading && !error;

  return (
    <div className="p-6 flex flex-col items-center w-full">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <p>{loadingMessage}</p>
      {description && <p>{description}</p>}

      {isLoading && (
        <div className="m-32">
          <MoonLoader color="#fff" size={40} />
        </div>
      )}

      {error ? (
        <p className="text-red-500 mt-4">{error}</p>
      ) : (
        <>
          {showArtists && start && end && (
            <motion.div
              className="flex justify-between items-center w-full m-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <ArtistCard artist={start} />
              <span className="text-4xl">→</span>
              <ArtistCard artist={end} />
            </motion.div>
          )}

          <motion.p
            className={`text-lg mt-4 ${success ? "text-green-400 font-bold" : "italic text-gray-300"}`}
            key={currentMessage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {currentMessage}
          </motion.p>
        </>
      )}
    </div>
  );
}
