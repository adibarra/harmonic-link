"use client";

import { useEffect, useRef, useMemo } from "react";
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

  return useMemo(() => {
    const isChainEmpty = chain.length === 2;
    const middleChain = chain.slice(1, -1);

    return (
      <div className="flex items-center space-x-6 h-218px">
        {renderChainItem(chain[0])}
        <span className="text-2xl">→</span>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-2 flex-nowrap max-w-[55vw] h-192px"
        >
          {middleChain.map((item, index) => (
            <div key={index} className="flex items-center space-x-6">
              {renderChainItem(item)}
            </div>
          ))}

          {!fullChain && <UnknownCard />}
        </div>

        <span className="text-2xl">→</span>
        {renderChainItem(chain[chain.length - 1])}
      </div>
    );
  }, [chain, fullChain]);
}
