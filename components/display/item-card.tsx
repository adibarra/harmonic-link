import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { DiscIcon, MicIcon } from "lucide-react";

interface ItemCardProps {
  item: ChainItem | null;
}

const isAlbum = (item: ChainItem): item is Album => {
  return "artist" in item;
};

export default function ItemCard({ item }: ItemCardProps) {
  const fadeInOut = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <>
      {item && (
        <motion.div key={item.id} {...fadeInOut}>
          <Card className="relative w-[192px] h-[218px] p-4 pb-6">
            <CardContent className="flex flex-col items-center text-center text-sm p-0">
              <div className="w-[128px] h-[128px]">
                <img
                  className="w-full h-full object-cover"
                  src={item.image}
                  alt=""
                  width={128}
                  height={128}
                />
              </div>
              <div className="mt-2 font-semibold text-base truncate w-full">{item.name}</div>
              {isAlbum(item) && (
                <div className="text-xs font-semibold opacity-50 truncate w-full">
                  {item.artist}
                </div>
              )}
            </CardContent>
            <div className="absolute flex flex-row gap-2 left-2 bottom-2 opacity-50">
              {isAlbum(item) ? (
                <>
                  <DiscIcon className="w-4 h-4" />
                  <span className="text-xs">Album</span>
                </>
              ) : (
                <>
                  <MicIcon className="w-4 h-4" />
                  <span className="text-xs">Artist</span>
                </>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </>
  );
}
