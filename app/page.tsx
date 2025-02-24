"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react"
import Image from "next/image";
import { Search } from "lucide-react";

export default function HarmonicLinks() {
  const [startArtist, setStartArtist] = useState<Artist>({ id: '', name: 'Imagine Dragons', image: 'https://i.scdn.co/image/ab67616100005174ab47d8dae2b24f5afe7f9d38' });
  const [endArtist, setEndArtist] = useState<Artist>({ id: '', name: 'Taylor Swift', image: 'https://i.scdn.co/image/ab67616100005174e672b5f553298dcdccb0e676' });
  const [searchTerm, setSearchTerm] = useState("");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [linkChain, setLinkChain] = useState<Album[]>([]);

  const handleSearch = () => {
    // Mock search results
    const mockResults = [
      { id: '', name: 'LOOM (Imagine Dragons)', image: '' },
      { id: '', name: 'Loosing (Groove Chorus)', image: '' },
      { id: '', name: 'Am I Still Dreaming? (Loose Room)', image: '' },
      { id: '', name: 'Totally Accountable (LOOM BAND$)', image: '' },
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
          <CardContent className="p-4 text-center">
            <Image src={startArtist.image} alt={startArtist.name} width="256" height="256" />
            {startArtist.name}
          </CardContent>
        </Card>
        <span className="text-xl">➡</span>
        <Input
          className="w-64"
          placeholder="Enter an album's name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={handleSearch}>
          <Search className="w-5 h-5 mr-2" /> Search
        </Button>
        <span className="text-xl">➡</span>
        <Card>
        <CardContent className="p-4 text-center">
            <Image src={endArtist.image} alt={endArtist.name} width="256" height="256" />
            {endArtist.name}
          </CardContent>
        </Card>
      </div>

      {albums.length > 0 && (
        <div className="space-y-2 w-64">
          {albums.map((album, index) => (
            <Button key={index} variant="outline" onClick={() => addToChain(album)}>
              {album.name}
            </Button>
          ))}
        </div>
      )}

      {linkChain.length > 0 && (
        <motion.div className="flex items-center space-x-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {linkChain.map((album, index) => (
            <Card key={index}>
              <CardContent className="p-2 text-sm">{album.name}</CardContent>
            </Card>
          ))}
        </motion.div>
      )}
    </div>
  );
}
