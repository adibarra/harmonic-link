"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowLeftToLineIcon, CalendarDays, Gamepad2, Infinity } from "lucide-react";

export default function GameModeMenu() {
  const router = useRouter();

  const fadeInOut = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <motion.div
      className="flex flex-col items-center space-y-8 p-6"
      {...fadeInOut}
    >
      <h1 className="text-3xl font-bold text-center">Harmonic Links</h1>
      <p className="text-center max-w-sm">
        Reach the target artist as quickly and directly as possible, minimizing the number of connections.
      </p>

      <div className="w-full max-w-sm space-y-4">
        <Button
          variant="secondary"
          className="w-full flex justify-start items-center gap-3 text-lg"
          onClick={() => router.push("/play/challenge")}
        >
          <CalendarDays className="w-5 h-5" />
          Daily Challenge
        </Button>

        <Button
          variant="secondary"
          className="w-full flex justify-start items-center gap-3 text-lg"
          onClick={() => router.push("/play/endless")}
        >
          <Infinity className="w-5 h-5" />
          Endless Mode
        </Button>

        <Button
          variant="secondary"
          className="w-full flex justify-start items-center gap-3 text-lg"
          onClick={() => router.push("/play/lobby")}
        >
          <Gamepad2 className="w-5 h-5" />
          Multiplayer
        </Button>

        <div className="w-full h-8 flex items-center justify-center">
          <div className="w-full border-t border-white" />
        </div>

        <Button
          variant="destructive"
          className="w-full flex justify-start items-center gap-3 text-lg"
          onClick={() => router.push("/")}
        >
          <ArrowLeftToLineIcon className="w-5 h-5" />
          Back
        </Button>
      </div>
    </motion.div>
  );
}
