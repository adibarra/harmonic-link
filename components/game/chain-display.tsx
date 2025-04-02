"use client";

import { useEffect, useMemo, useRef } from "react";
import AlbumCard from "./album-card";
import ArtistCard from "./artist-card";

interface ChainDisplayProps {
  chain: ChainItem[];
  fullChain?: boolean;
}

export default function ChainDisplay({
  chain,
  fullChain = false,
}: ChainDisplayProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [chain]);

  const renderChainItem = (item: ChainItem) => {
    if (!item) return null;
    return "artist" in item ? <AlbumCard album={item} /> : <ArtistCard artist={item} />;
  };

  const chainDisplay = useMemo(() => {
    if (chain.length === 2) {
      return (
        <>
          {renderChainItem(chain[0])}
          <span className="text-xl">➡</span>
          <span className="text-gray-500 w-56 pl-2 pr-4">Select an album or artist to begin the chain.</span>
          <span className="text-xl">➡</span>
          {renderChainItem(chain[1])}
        </>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        {renderChainItem(chain[0])}
        <span className="text-xl">➡</span>
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-2 flex-nowrap max-w-[55vw] scroll-right"
        >
          {chain.slice(1, -1).map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              {renderChainItem(item)}
              {index < chain.length - 3 && <span className="text-xl">➡</span>}
            </div>
          ))}
        </div>
        {!fullChain && (
          <div className="flex items-center space-x-2">
            <span className="text-xl">➡</span>
            <span className="text-gray-500">?</span>
          </div>
        )}
        <span className="text-xl">➡</span>
        {chain.length > 1 && renderChainItem(chain[chain.length - 1])}
      </div>
    );

  }, [chain, fullChain]);

  return (
    <div className="flex items-center space-x-2">
      {chainDisplay}
    </div>
  );
}
