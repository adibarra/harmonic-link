"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import Image from "next/image";
import { Search } from "lucide-react";

export default function HarmonicLinks() {
  const [startArtist, setStartArtist] = useState<Artist>({ id: '', name: 'Imagine Dragons', image: 'https://i.scdn.co/image/ab67616100005174ab47d8dae2b24f5afe7f9d38' });
  const [endArtist, setEndArtist] = useState<Artist>({ id: '', name: 'Taylor Swift', image: 'https://i.scdn.co/image/ab67616100005174e672b5f553298dcdccb0e676' });
  const [searchTerm, setSearchTerm] = useState("");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [linkChain, setLinkChain] = useState<Album[]>([]);

  const handleSearch = () => {
    const mockResults = [
      { id: '', name: 'LOOM (Imagine Dragons)', image: 'https://placehold.co/150/png' },
      { id: '', name: 'Loosing (Groove Chorus)', image: 'https://placehold.co/150/png' },
      { id: '', name: 'Am I Still Dreaming? (Loose Room)', image: 'https://placehold.co/150/png' },
      { id: '', name: 'Totally Accountable (LOOM BAND$)', image: 'https://placehold.co/150/png' },
    ];
    setAlbums(mockResults);
  };

  const addToChain = (album: Album) => {
    setLinkChain([...linkChain, album]);
  };

  return (
    <div className="p-6 flex flex-col items-center space-y-6">
      <div className="flex items-center space-x-6">
        <Card>
          <CardContent className="p-4 pb-2 text-center flex-col">
            <Image src={startArtist.image} alt={startArtist.name} width="256" height="256" />
            <div className="grow h-2" />
            {startArtist.name}
          </CardContent>
        </Card>
        <span className="text-xl">➡</span>
        {linkChain.length > 0 ? (
          <motion.div className="flex items-center space-x-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {linkChain.map((album, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Card>
                  <CardContent className="p-2 text-sm text-center">
                    <Image src={album.image} alt={album.name} width="64" height="64" />
                    {album.name}
                  </CardContent>
                </Card>
                {index < linkChain.length - 1 && <span className="text-xl">➡</span>}
              </div>
            ))}
          </motion.div>
        ) : (
          <span className="text-gray-500">Search for an album to begin the chain</span>
        )}
        <span className="text-xl">➡</span>
        <Card>
          <CardContent className="p-4 pb-2 text-center flex-col">
            <Image src={endArtist.image} alt={endArtist.name} width="256" height="256" />
            <div className="grow h-2" />
            {endArtist.name}
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Input
          className="w-full"
          placeholder="Enter an album's name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button className="absolute right-0 top-0 h-full" onClick={handleSearch}>
          <Search className="w-5 h-5 mr-2" /> Search
        </Button>
        {albums.length > 0 && (
          <div className="absolute w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-10">
            {albums.map((album, index) => (
              <Button key={index} variant="outline" className="w-full text-left" onClick={() => addToChain(album)}>
                {album.name}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
