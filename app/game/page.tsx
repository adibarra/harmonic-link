"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import Image from "next/image";
import { Search } from "lucide-react";
import debounce from 'lodash/debounce';

export default function HarmonicLinks() {
  const [startArtist, setStartArtist] = useState<Artist>({ id: '', name: 'Imagine Dragons', image: 'https://i.scdn.co/image/ab67616100005174ab47d8dae2b24f5afe7f9d38' });
  const [endArtist, setEndArtist] = useState<Artist>({ id: '', name: 'Taylor Swift', image: 'https://i.scdn.co/image/ab67616100005174e672b5f553298dcdccb0e676' });
  const [searchTerm, setSearchTerm] = useState("");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [linkChain, setLinkChain] = useState<Album[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      setError(null);
      // Replace this with your actual API call
      const mockResults: Album[] = [
        { id: '1', name: 'LOOM', artist: 'Imagine Dragons', image: 'https://placehold.co/150/png' },
        { id: '2', name: 'Loosing', artist: 'Groove Chorus', image: 'https://placehold.co/150/png' },
        { id: '3', name: 'Am I Still Dreaming?', artist: 'Loose Room', image: 'https://placehold.co/150/png' },
        { id: '4', name: 'Totally Accountable', artist: 'LOOM BAND$', image: 'https://placehold.co/150/png' },
      ];
      setAlbums(mockResults);
    } catch (err) {
      setError("Failed to fetch albums. Please try again.");
    }
  };

  const debouncedSearch = useCallback(
    debounce(() => {
      if (searchTerm) handleSearch();
    }, 300),
    [searchTerm]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearch();
  };

  const addToChain = (album: Album) => {
    setLinkChain([...linkChain, album]);
  };

  return (
    <div className="p-6 flex flex-col items-center space-y-6 h-90vh">
      <h1 className="text-3xl font-bold mb-6">Harmonic Links</h1>
      <div className="flex items-center space-x-6">
        {/* Start Artist Card */}
        <Card className="p-4">
          <CardContent className="text-center flex-col">
            <Image src={startArtist.image} alt={startArtist.name} width="256" height="256" />
            <div className="grow h-2" />
            {startArtist.name}
          </CardContent>
        </Card>
        <span className="text-xl">➡</span>

        {/* Link Chain */}
        {linkChain.length > 0 ? (
          <motion.div className="flex items-center space-x-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {linkChain.map((album, index) => (
              <div key={album.id || index} className="flex items-center space-x-2">
                <Card className="p-2">
                  <CardContent className="text-sm text-center">
                    <div className="flex justify-center">
                      <Image src={album.image} alt={album.name} width="64" height="64" />
                    </div>
                    <div className="font-bold">{album.name}</div>
                    <div className="text-xs opacity-80">{album.artist}</div>
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
        {/* End Artist Card */}
        <Card className="p-4">
          <CardContent className="text-center flex-col">
            <Image src={endArtist.image} alt={endArtist.name} width="256" height="256" />
            <div className="grow h-2" />
            {endArtist.name}
          </CardContent>
        </Card>
      </div>

      {/* Search Input */}
      <div className="relative w-full max-w-md">
        <Input
          className="w-full p-2"
          placeholder="Enter an album's name"
          value={searchTerm}
          onChange={onInputChange}
          aria-label="Album Search"
        />
        {albums.length > 0 && (
          <div className="absolute w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-10">
            {albums.map((album, index) => (
                <Button key={album.id || index} variant="outline" className="w-full flex p-2" onClick={() => addToChain(album)}>
                  <div className="flex grow">
                    <Image src={album.image} alt={album.name} width="40" height="40" className="mr-2 p-1" />
                    <div className="flex flex-col">
                      <div className="font-bold text-left">{album.name}</div>
                      <div className="text-xs opacity-80 text-left">{album.artist}</div>
                    </div>
                  </div>
                </Button>
            ))}
          </div>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
