"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MicIcon } from "lucide-react";
import Image from "next/image";

interface ArtistCardProps {
  artist: Artist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Card className="relative w-[192px] h-[218px] p-4 pb-6">
      <CardContent className="flex flex-col items-center text-center text-sm p-0">
        <div className="w-[128px] h-[128px]">
        <Image
            priority
            className="w-full h-full object-cover"
            src={artist.image}
            alt={artist.name}
            width={128}
            height={128}
          />
        </div>
        <div className="mt-2 font-semibold text-base truncate w-full">{artist.name}</div>
      </CardContent>
      <div className="absolute flex flex-row gap-2 left-2 bottom-2 text-gray-500">
        <MicIcon className="w-4 h-4" />
        <span className="text-xs">Artist</span>
      </div>
    </Card>
  );
}
