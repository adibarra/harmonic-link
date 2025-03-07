"use client";

import React, { useState } from "react";


interface GameScreenProps {
  mode: string;
}

const GameScreen: React.FC<GameScreenProps> = ({ mode }) => {
  // Example images for the connection path (replace with actual dynamic images)
  const connectionImages = [
    "/images/shawn_mendes.jpg",
    "/images/placeholder.png",
    "/images/placeholder.png",
    "/images/placeholder.png",
    "/images/placeholder.png",
  ];
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);

  const songs = [
    "Air ft. Astrid",
    "The Christmas Song ft. Camila Cabello",
    "I Know What You Did Last Summer ft. Camila Cabello",
    "Like To Be You ft. Julia Michaels",
    "Monster ft. Justin Bieber",
    "Señorita ft. Camila Cabello",
    "Youth ft. Khalid",
  ];

   // Toggle selection when clicking an item
   const toggleSelection = (song: string) => {
    setSelectedSongs((prevSelected) =>
      prevSelected.includes(song)
        ? prevSelected.filter((s) => s !== song) // Remove if already selected
        : [...prevSelected, song] // Add if not selected
    );
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center mb-10">Connect These Two Artists</h1>

      {/* Album Connection Path */}
      <div className="flex items-center space-x-6 mt-6">
        <div className="flex flex-col items-center">
          <img src="/images/imagine_dragons.jpeg" alt="Imagine Dragons" className="w-40 h-40 rounded-lg" />
          <p className="mt-2 text-center">Imagine Dragons</p>
        </div>

        <span className="text-5xl font-bold">→</span>

        {/* Placeholder for connection images */}
        <div className="flex items-center space-x-2 bg-gray-800 p-4 rounded-lg">
        {connectionImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Connection ${index + 1}`}
              className="w-12 h-12 rounded-md"
            />
          ))}
        </div>

        <span className="text-5xl font-bold">→</span>

        <div className="flex flex-col items-center">
          <img src="/images/taylor-swift.jpg" alt="Taylor Swift" className="w-40 h-40 rounded-lg" />
          <p className="mt-2 text-center">Taylor Swift</p>
        </div>
      </div>

      {/* Play Now Button
      <a href={`/game/${mode}`}>
        <button className="mt-8 px-6 py-3 bg-purple-500 rounded-lg text-white text-lg hover:bg-purple-600">
          Play now!
        </button>
      </a> */}

      {/* Selectable Song List */}
      <div className="w-full max-w-2xl mt-10 space-y-3">
        {songs.map((song, index) => (
          <div
            key={index}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
              selectedSongs.includes(song) ? "bg-blue-500 text-white" : "bg-gray-800"
            }`}
            onClick={() => toggleSelection(song)}
          >
            <img src={'/images/placeholder.png'} alt={song} className="w-12 h-12 rounded-md mr-3" />
            <span>{song}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameScreen;
