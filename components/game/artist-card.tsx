"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface ArtistCardProps {
  artist: Artist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Card className="p-4">
      <CardContent className="text-center flex-col">
        <Image src={artist.image} alt={artist.name} width={256} height={256} />
        <div className="grow h-2" />
        {artist.name}
      </CardContent>
    </Card>
  );
}
