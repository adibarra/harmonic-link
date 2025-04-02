"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MoonLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import ArtistCard from "@/components/game/artist-card";

export default function LoadingPage() {
  const router = useRouter();

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

  const [currentMessage, setCurrentMessage] = useState<string>(messages[0]);
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

    const fetchArtists = async () => {
      try {
        // simulate API loading time
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // mock successful response
        const data = {
          success: true,
          startArtist: {
            id: "4ZAk3yVJdtf1CFnTiG08U3",
            name: "Luna Li",
            image: "https://i.scdn.co/image/ab6761610000e5ebdaeee87c9a49ac7d03d3d883",
          },
          endArtist: {
            id: "2kQnsbKnIiMahOetwlfcaS",
            name: "Raveena",
            image: "https://i.scdn.co/image/ab6761610000e5eb5942a3bbc3b764b2a2934776",
          },
        };

        if (data.success) {
          clearInterval(messageInterval);
          setStartArtist(data.startArtist);
          setEndArtist(data.endArtist);
          setSuccess(true);
          setCurrentMessage("Found a path. Get ready!");
          setTimeout(() => {
            router.push(`/game?start=${data.startArtist.id}&end=${data.endArtist.id}`);
          }, 5000);
        } else {
          throw new Error("Failed to find a path. Try refreshing.");
        }
      } catch (err) {
        setError("Failed to find a path. Try refreshing.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();

    return () => clearInterval(messageInterval);
  }, [router]);

  return (
    <div className="p-6 flex flex-col items-center w-full">
      <h1 className="text-3xl font-bold mb-6">Harmonic Links</h1>
      <p>Finding two artists to connect through their music.</p>
      <p>This may take a few seconds.</p>

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
              ➡
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
