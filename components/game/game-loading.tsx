"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MoonLoader } from "react-spinners";
import ItemCard from "@/components/display/item-card";

interface LoadingGameProps {
  challenge?: Challenge | null;
  loadingMessage?: string;
  successMessage?: string;
  title?: string;
  description?: string | React.ReactNode;
  error?: string | null;
}

export default function LoadingGame({
  challenge = null,
  loadingMessage = "Finding two artists to connect through their music...",
  successMessage = "Found a path. Get ready!",
  title = "Harmonic Links",
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
  const isLoading = challenge === null;
  const success = !isLoading && !error;

  useEffect(() => {
    const shuffledMessages = [...messages].sort(() => Math.random() - 0.5);

    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => {
        const nextIndex = (shuffledMessages.indexOf(prev) + 1) % shuffledMessages.length;
        return shuffledMessages[nextIndex];
      });
    }, 3000);

    if (success) {
      setCurrentMessage(successMessage);
      clearInterval(messageInterval);
    }

    return () => clearInterval(messageInterval);
  }, [isLoading, error, successMessage, success]);

  return (
    <div className="p-6 flex flex-col items-center w-full">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <p>{loadingMessage}</p>

      {isLoading && (
        <div className="m-32">
          <MoonLoader color="#fff" size={40} />
        </div>
      )}

      {error ? (
        <p className="text-red-500 mt-4">{error}</p>
      ) : (
        <>
          {!isLoading && !error && challenge && (
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="flex justify-between items-center w-full m-12">
                <ItemCard item={challenge.start} />
                <span className="text-4xl">→</span>
                <ItemCard item={challenge.end} />
              </div>
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
