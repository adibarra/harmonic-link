"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export default function Home() {

  const fadeInOut = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <motion.div
      className=""
      {...fadeInOut}
    >
      <main className="flex-1 flex flex-col gap-6 px-4">
        <div className="flex flex-col gap-16 items-center text-center p-6 mb-12">
          <h1 className="text-5xl font-bold">Harmonic Links</h1>
          <p className="text-xl max-w-2xl">
            Discover the musical connections between your favorite artists. Start with one artist and find the path to another through their albums and collaborations.
          </p>
        </div>

        <div className="mx-auto mb-12">
          <Link href="/play">
            <Button variant="secondary" className="py-2 text-lg transition duration-300">
              Select a Game Mode
            </Button>
          </Link>
        </div>

        <div className="flex flex-col gap-6 items-center text-center p-6 mb-12">
          <h2 className="text-3xl font-bold">How to Play</h2>
          <p className="text-lg max-w-2xl">
            Start with one artist and find the path to another through their albums and collaborations to reach the target artist.
          </p>
        </div>
      </main>
    </motion.div>
  );
}
