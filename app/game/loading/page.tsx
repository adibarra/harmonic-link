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
    "Searching for harmonic pathways...",
    "Spinning vinyls...",
    "Building melodic bridges...",
    "Tracing hidden collaborations...",
    "Syncing BPMs...",
    "Diving into sample archives...",
    "Following producer fingerprints...",
    "Unraveling tour bus stories...",
    "Mapping out discography detours...",
    "Letting the algorithm jam...",
    "Cross-referencing liner notes...",
    "Rewinding cassette tapes...",
    "Reconstructing remixes...",
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
        await new Promise((resolve) => setTimeout(resolve, 14000));

        // mock successful response
        const data = {
          success: true,
          startArtist: {
            id: "000",
            name: "Imagine Dragons",
            image: "https://i.scdn.co/image/ab67616100005174ab47d8dae2b24f5afe7f9d38",
          },
          endArtist: {
            id: "001",
            name: "Taylor Swift",
            image: "https://i.scdn.co/image/ab67616100005174e672b5f553298dcdccb0e676",
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
