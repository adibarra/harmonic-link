"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import AlbumCard from "./album-card";
import ArtistCard from "./artist-card";

interface ChainDisplayProps {
  chain: ChainItem[];
  hideQuestionMark?: boolean;
  fullChain?: boolean;
}

export default function ChainDisplay({
  chain,
  hideQuestionMark = false,
  fullChain = false,
}: ChainDisplayProps) {
  const renderCard = (item: ChainItem) => {
    return "artist" in item ? <AlbumCard album={item} /> : <ArtistCard artist={item} />;
  };

  const chainDisplay = useMemo(() => {
    if (chain.length === 1) {
      return (
        <>
          {renderCard(chain[0])}
          <span className="text-xl">➡</span>
          <span className="text-gray-500">Search for an album or artist to begin the chain</span>
        </>
      );
    }

    if (fullChain) {
      return (
        <div className="flex items-center space-x-2">
          {chain.map((item, index) => (
            <div key={item.id || index} className="flex items-center space-x-2">
              {renderCard(item)}
              {index < chain.length - 1 && <span className="text-xl">➡</span>}
            </div>
          ))}
        </div>
      );
    }

    if (chain.length >= 3) {
      const firstItem = chain[0];
      const secondToLast = chain[chain.length - 2];
      const lastItem = chain[chain.length - 1];
      return (
        <div className="flex items-center space-x-2">
          {renderCard(firstItem)}
          <span className="text-xl">➡</span>
          <span className="text-xl">...</span>
          <span className="text-xl">➡</span>
          {renderCard(secondToLast)}
          <span className="text-xl">➡</span>
          {renderCard(lastItem)}
        </div>
      );
    }

    return (
      <motion.div className="flex items-center space-x-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {chain.map((item, index) => (
          <div key={item.id || index} className="flex items-center space-x-2">
            {renderCard(item)}
            {index < chain.length - 1 && <span className="text-xl">➡</span>}
          </div>
        ))}
      </motion.div>
    );
  }, [chain, fullChain]);

  return (
    <div className="flex items-center space-x-2">
      {chainDisplay}
      {chain.length > 0 && !hideQuestionMark && chain.length > 1 && (
        <>
          <span className="text-xl">➡</span>
          <Button variant="ghost" className="text-xl" aria-label="More options">
            ?
          </Button>
        </>
      )}
    </div>
  );
}
