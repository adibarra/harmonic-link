"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { MoonLoader } from "react-spinners";
import SearchDropdown from "@/components/search-dropdown";
import ArtistCard from "@/components/artist-card";
import ChainDisplay from "@/components/chain-display";
import useDebounce from "../hooks/useDebounce";

interface Artist {
  id: string;
  name: string;
  image: string;
}

interface Album {
  id: string;
  name: string;
  artist: string;
  image: string;
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
            <MoonLoader size={18} color="#fff" />
          </div>
        )}
        {albums.length > 0 && <SearchDropdown albums={albums} onSelect={addToChain} />}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
