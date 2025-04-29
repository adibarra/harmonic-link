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
    <motion.div {...fadeInOut} className="flex flex-col justify-center text-white">
      <main className="flex-1 flex flex-col items-center gap-16 p-6 text-center">

        <motion.div {...fadeInOut} className="mt-12">
          <h1 className="text-6xl font-extrabold mb-6">Harmonic Links</h1>
          <p className="text-2xl max-w-3xl mx-auto text-gray-300">
            Connect your favorite artists through albums, collaborations, and hidden influences.
          </p>
        </motion.div>

        <motion.div {...fadeInOut}>
          <Link href="/play">
            <Button variant="secondary" className="py-4 px-8 text-xl font-bold">
              Start Playing
            </Button>
          </Link>
        </motion.div>

        <motion.div {...fadeInOut} className="flex flex-col gap-8 items-center max-w-3xl mt-12">
          <h2 className="text-4xl font-bold mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg text-gray-400">
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-semibold text-white mb-2">Step 1: Start with an Artist</h3>
              <p>We'll pick a random artist for you to begin your journey.</p>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-semibold text-white mb-2">Step 2: Explore Connections</h3>
              <p>Navigate through albums and collaborations to discover new links.</p>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-semibold text-white mb-2">Step 3: Build the Path</h3>
              <p>Alternate between artists and albums to trace a path to the target artist.</p>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-semibold text-white mb-2">Step 4: Reach the Goal</h3>
              <p>Find the shortest route and complete the challenge!</p>
            </div>
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
}
