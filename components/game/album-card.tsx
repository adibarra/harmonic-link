"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DiscIcon } from "lucide-react";
import Image from "next/image";

interface AlbumCardProps {
  album: Album;
}

export default function AlbumCard({ album }: AlbumCardProps) {
  return (
    <Card className="relative w-[192px] h-full p-4 pb-6">
      <CardContent className="flex flex-col items-center text-center text-sm p-0">
        <div className="w-[128px] h-[128px]">
          <Image
            priority
            className="w-full h-full object-cover"
            src={album.image}
            alt={album.name}
            width={128}
            height={128}
          />
        </div>
        <div className="mt-2 font-semibold text-base truncate w-full">{album.name}</div>
        <div className="text-xs text-gray-500 truncate w-full">{album.artist}</div>
      </CardContent>
      <div className="absolute flex flex-row gap-2 left-2 bottom-2 text-gray-500">
        <DiscIcon className="w-4 h-4" />
        <span className="text-xs">Album</span>
      </div>
    </Card>
  );
}
