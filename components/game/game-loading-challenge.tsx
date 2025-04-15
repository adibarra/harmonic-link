"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MoonLoader } from "react-spinners";
import ArtistCard from "@/components/game/artist-card";
import { fetchDaily } from "@/services/fetchDaily";
import { fetchAlbumAlbum } from "@/services/fetchAlbumAlbum";
import { fetchArtistArtist } from "@/services/fetchArtistArtist";

interface LoadingGameProps {
  onSuccess: (start: ChainItem, end: ChainItem) => void;
}

export default function LoadingGame({ onSuccess }: LoadingGameProps) {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [startArtist, setStartArtist] = useState<Artist | null>(null);
  const [endArtist, setEndArtist] = useState<Artist | null>(null);

  useEffect(() => {
    const shuffledMessages = [...messages].sort(() => Math.random() - 0.5);
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => {
        const nextIndex = (shuffledMessages.indexOf(prev) + 1) % shuffledMessages.length;
        return shuffledMessages[nextIndex];
      });
    }, 3000);

    const fetchChallenge = async () => {
      try {
        const [artists] = await Promise.all([
          await fetchDaily(),
          new Promise((resolve) => setTimeout(resolve, 1000)),
        ]);

        if (artists && artists.length > 0) {
          const startArtist = artists[0];
          const endArtist = artists[1];

          clearInterval(messageInterval);
          setStartArtist(startArtist);
          setEndArtist(endArtist);
          setSuccess(true);
          setCurrentMessage("Found today's challenge. Get ready!");

          setTimeout(() => {
            onSuccess(startArtist, endArtist);
          }, 6000);
        } else {
          throw new Error("Failed to find today's challenge. Try refreshing.");
        }
      } catch (err) {
        setError("Failed to find today's challenge. Try refreshing.");
        console.error(err);
      } finally {
        setLoading(false);
        clearInterval(messageInterval);
      }
    };

    fetchChallenge();

    return () => clearInterval(messageInterval);
  }, [onSuccess]);

  return (
    <div className="p-6 flex flex-col items-center w-full">
      <h1 className="text-3xl font-bold mb-6">Harmonic Links</h1>
      <p>Getting today's daily challenge ready...</p>

      {loading && (
        <div className="m-32">
          <MoonLoader color="#fff" size={40} />
        </div>
      )}

      {error ? (
        <p className="text-red-500 mt-4">{error}</p>
      ) : (
        <>
          {startArtist && endArtist && (
            <motion.div
              className="flex justify-between items-center w-full m-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <ArtistCard artist={startArtist} />
              <span className="text-4xl">→</span>
              <ArtistCard artist={endArtist} />
            </motion.div>
          )}

          <motion.p
            className={`text-lg mt-4 ${success ? "text-green-400 font-bold" : "italic text-gray-300"}`}
            key={currentMessage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {currentMessage}
          </motion.p>
        </>
      )}
    </div>
  );
}

