"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import AlbumCard from "./album-card";

interface ChainDisplayProps {
  chain: Album[];
}

export default function ChainDisplay({ chain }: ChainDisplayProps) {
  const chainDisplay = useMemo(() => {
    if (chain.length === 0) {
      return <span className="text-gray-500">Search for an album to begin the chain</span>;
    }

    if (chain.length >= 3) {
      const secondToLast = chain[chain.length - 2];
      const lastAlbum = chain[chain.length - 1];
      return (
        <div className="flex items-center space-x-2">
          <span className="text-xl">...</span>
          <span className="text-xl">➡</span>
          <AlbumCard album={secondToLast} />
          <span className="text-xl">➡</span>
          <AlbumCard album={lastAlbum} />
        </div>
      );
    }

    return (
      <motion.div className="flex items-center space-x-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {chain.map((album, index) => (
          <div key={album.id || index} className="flex items-center space-x-2">
            <AlbumCard album={album} />
            {index < chain.length - 1 && <span className="text-xl">➡</span>}
          </div>
        ))}
      </motion.div>
    );
  }, [chain]);

  return (
    <div className="flex items-center space-x-2">
      {chainDisplay}
      {chain.length > 0 && (
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
