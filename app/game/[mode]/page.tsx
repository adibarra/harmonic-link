"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import GameScreen from "@/components/Game-Screen"; // Fix the import path

const GamePage = () => {
  const params = useParams();
  return <GameScreen mode={params.mode as string} />;
};

export default GamePage;
