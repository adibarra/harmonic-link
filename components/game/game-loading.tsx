"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MoonLoader } from "react-spinners";
import ItemCard from "@/components/display/item-card";

const messages = [
  "Tuning instruments...",
  "Syncing BPMs...",
  "Spinning vinyls...",
  "Reconstructing remixes...",
  "Diving into sample archives...",
  "Tracing hidden collaborations...",
  "Letting the algorithm jam...",
  "Rewinding cassette tapes...",
];

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
  const [currentMessage, setCurrentMessage] = useState('');
  const isLoading = challenge === null;
  const success = !isLoading && !error;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (success) {
      setCurrentMessage(successMessage);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const shuffledMessages = messages.sort(() => Math.random() - 0.5);
    const updateMessage = () => {
      setCurrentMessage(prev => {
        const currentIndex = shuffledMessages.indexOf(prev);
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % shuffledMessages.length;
        return shuffledMessages[nextIndex];
      });
    };

    updateMessage();
    intervalRef.current = setInterval(updateMessage, 2500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [error, success, successMessage]);

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
              <div className="flex justify-between items-center w-full m-12 mb-6">
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
