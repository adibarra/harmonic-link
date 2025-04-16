"use client";

import { useEffect, useRef, useMemo } from "react";
import { motion } from "motion/react";
import AlbumCard from "./album-card";
import ArtistCard from "./artist-card";
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

  const renderChainItem = (item: ChainItem) =>
    item ? ("artist" in item ? <AlbumCard album={item} /> : <ArtistCard artist={item} />) : null;

  const fadeInOut = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 },
  };

  return useMemo(() => {
    const isChainEmpty = chain.length === 2;
    const middleChain = chain.slice(1, -1);

    return (
      <motion.div className="flex items-center space-x-6 h-218px" {...fadeInOut}>
        <motion.div {...fadeInOut}>{renderChainItem(chain[0])}</motion.div>
        <span className="text-2xl">→</span>

        <motion.div
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-2 flex-nowrap max-w-[55vw] h-192px"
          {...fadeInOut}
        >
          {middleChain.map((item, index) => (
            <motion.div key={index} className="flex items-center space-x-6" {...fadeInOut}>
              {renderChainItem(item)}
            </motion.div>
          ))}

          {!fullChain && <UnknownCard />}
        </motion.div>

        <span className="text-2xl">→</span>
        <motion.div {...fadeInOut}>{renderChainItem(chain[chain.length - 1])}</motion.div>
      </motion.div>
    );
  }, [chain, fullChain]);
}
