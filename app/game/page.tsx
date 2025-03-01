"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import Image from "next/image";
import debounce from "lodash/debounce";
import { MoonLoader } from "react-spinners";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedValue(value);
    }, delay);

    handler();
    return () => {
      handler.cancel();
    };
  }, [value, delay]);

  return debouncedValue;
}

interface ArtistCardProps {
  artist: Artist;
}

function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Card className="p-4">
      <CardContent className="text-center flex-col">
        <Image src={artist.image} alt={artist.name} width="256" height="256" />
        <div className="grow h-2" />
        {artist.name}
      </CardContent>
    </Card>
  );
}

interface AlbumCardProps {
  album: Album;
  size?: number;
}

function AlbumCard({ album, size = 64 }: AlbumCardProps) {
  return (
    <Card className="p-2">
      <CardContent className="text-sm text-center">
        <Image src={album.image} alt={album.name} width={size} height={size} />
        <div className="font-bold">{album.name}</div>
        <div className="text-xs opacity-80">{album.artist}</div>
      </CardContent>
    </Card>
  );
}

interface ChainDisplayProps {
  chain: Album[];
}

function ChainDisplay({ chain }: ChainDisplayProps) {
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

interface SearchDropdownProps {
  albums: Album[];
  onSelect: (album: Album) => void;
}

function SearchDropdown({ albums, onSelect }: SearchDropdownProps) {
  return (
    <div className="absolute w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-10">
      {albums.map((album, index) => (
        <Button
          key={album.id || index}
          variant="outline"
          className="w-full flex p-2"
          onClick={() => onSelect(album)}
        >
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
  );
}

export default function HarmonicLinks() {
  const [startArtist] = useState<Artist>({
    id: "",
    name: "Imagine Dragons",
    image: "https://i.scdn.co/image/ab67616100005174ab47d8dae2b24f5afe7f9d38",
  });
  const [endArtist] = useState<Artist>({
    id: "",
    name: "Taylor Swift",
    image: "https://i.scdn.co/image/ab67616100005174e672b5f553298dcdccb0e676",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [linkChain, setLinkChain] = useState<Album[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearch();
    }
  }, [debouncedSearchTerm]);

  const fetchAlbums = async (query: string): Promise<Album[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "1",
            name: "LOOM",
            artist: "Imagine Dragons",
            image: "https://placehold.co/150/png",
          },
          {
            id: "2",
            name: "Loosing",
            artist: "Groove Chorus",
            image: "https://placehold.co/150/png",
          },
          {
            id: "3",
            name: "Am I Still Dreaming?",
            artist: "Loose Room",
            image: "https://placehold.co/150/png",
          },
          {
            id: "4",
            name: "Totally Accountable",
            artist: "LOOM BAND$",
            image: "https://placehold.co/150/png",
          },
        ]);
      }, 500);
    });
  };

  const handleSearch = async () => {
    try {
      setError(null);
      setLoading(true);
      const results = await fetchAlbums(searchTerm);
      setAlbums(results);
    } catch (err) {
      setError("Failed to fetch albums. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const addToChain = (album: Album) => {
    setLinkChain([...linkChain, album]);
    setSearchTerm("");
    setAlbums([]);
  };

  return (
    <div className="p-6 flex flex-col items-center space-y-6 h-[90vh]">
      <h1 className="text-3xl font-bold mb-6">Harmonic Links</h1>
      <div className="flex items-center space-x-6">
        <ArtistCard artist={startArtist} />
        <span className="text-xl">➡</span>
        <ChainDisplay chain={linkChain} />
        <span className="text-xl">➡</span>
        <ArtistCard artist={endArtist} />
      </div>

      <div className="relative w-full max-w-md">
        <Input
          className="w-full p-2"
          placeholder="Enter an album's name"
          value={searchTerm}
          onChange={onInputChange}
          aria-label="Album Search"
        />
        {loading && (
          <div className="absolute top-0 right-0 p-2">
            <MoonLoader size={18} color="#fff" /> {/* Spinner component */}
          </div>
        )}
        {albums.length > 0 && <SearchDropdown albums={albums} onSelect={addToChain} />}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
