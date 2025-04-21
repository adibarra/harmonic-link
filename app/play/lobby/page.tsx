"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import { v4 as uuidv4 } from "uuid";

export default function LobbyEntry() {
  const router = useRouter();
  const [channelCode, setChannelCode] = useState("");

  const handleCreateLobby = () => {
    const newChannel = uuidv4().split("-")[0];
    router.push(`/play/lobby/${newChannel}`);
  };

  const handleJoinLobby = () => {
    if (channelCode.trim()) {
      router.push(`/play/lobby/${channelCode.trim()}`);
    }
  };

  const fadeInOut = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <motion.div
      className="flex flex-col items-center space-y-6 p-6"
      {...fadeInOut}
    >
      <h1 className="text-4xl font-bold">Multiplayer Game</h1>
      <p className="text-lg text-muted-foreground">Create or join a lobby to play with others</p>

      <div className="flex flex-col space-y-4 w-full max-w-md">
        <Button className="w-full text-lg" onClick={handleCreateLobby}>
          Create Lobby
        </Button>

        <div className="flex space-x-2">
          <Input
            placeholder="Enter lobby code"
            value={channelCode}
            onChange={(e) => setChannelCode(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleJoinLobby}>Join</Button>
        </div>
      </div>
    </motion.div>
  );
}
