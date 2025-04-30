"use client";

import { useEffect, useRef, useMemo } from "react";
import { motion } from "motion/react";
import ItemCard from "./item-card";
import UnknownCard from "./unknown-card";

interface ChainDisplayProps {
  chain: ChainItem[];
  fullChain?: boolean;
}

export default function ChainDisplay({ chain, fullChain = false }: ChainDisplayProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [chain]);

  const fadeInOut = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 },
  };

  return useMemo(() => {
    const middleChain = chain.slice(1, -1);

    return (
      <motion.div className="flex items-center justify-center space-x-6 w-[90svw] max-w-[1250px]" {...fadeInOut}>
        <ItemCard item={chain[0]} />
        <span className="text-2xl">→</span>

        <div
          ref={scrollContainerRef}
          className="hidden lg:flex overflow-x-auto space-x-2 flex-nowrap items-center justify-center w-fit md:max-w-[80svw]"
        >
          {middleChain.map((item, index) => (
            <ItemCard key={index} item={item} />
          ))}
          {!fullChain && <UnknownCard />}
        </div>

        <span className="hidden lg:block text-2xl">→</span>
        <ItemCard item={chain[chain.length - 1]} />
      </motion.div>
    );
  }, [chain, fullChain]);
}
