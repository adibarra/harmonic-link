"use client";

import { useState, useEffect } from "react";
import { MoonLoader } from "react-spinners";
import ChainDisplay from "@/components/display/chain-display";
import { fetchAlbums } from "@/services/fetchAlbums";
import { fetchAlbumArtists } from "@/services/fetchAlbumArtists";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ClockIcon, DiscIcon, MicIcon } from "lucide-react";
import { formatElapsedTime } from "@/utils/utils";
import fuzzysort from "fuzzysort";

interface GameProps {
  linkChain: ChainItem[];
  setLinkChain: (chain: any) => any;
  onGameOver: () => void;
}

export default function Game({ linkChain, setLinkChain, onGameOver }: GameProps) {
  const [items, setItems] = useState<ChainItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ChainItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getItems = async () => {
      setLoading(true);
      try {
        const lastItem = linkChain[linkChain.length - 2];
        if ("artist" in lastItem) {
          const fetchedArtists = await fetchAlbumArtists(lastItem.id);
          setItems(fetchedArtists?.sort((a, b) => a.name.localeCompare(b.name)) || []);
        } else {
          const fetchedAlbums = await fetchAlbums(lastItem.id);
          setItems(fetchedAlbums?.sort((a, b) => a.name.localeCompare(b.name)) || []);
        }
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    getItems();
  }, [linkChain]);

  useEffect(() => {
    const lastItem = linkChain[linkChain.length - 1];
    const secondLastItem = linkChain[linkChain.length - 2];

    if (lastItem.id === secondLastItem.id) {
      setLinkChain((prev: any) => {
        return prev.length > 2 ? [...prev.slice(0, -2), prev[prev.length - 1]] : prev;
      });
      onGameOver();
    }
  }, [linkChain]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items);
    } else {
      const results = fuzzysort.go(searchQuery, items, { key: "name" });
      setFilteredItems(results.map((result) => result.obj));
    }
  }, [searchQuery, items]);

  return (
    <div className="flex flex-col items-center space-y-6">
      <ChainDisplay chain={linkChain} />

      {linkChain.length > 1 && (
        <div className="flex items-center space-x-6">
          <Button
            variant="destructive"
            className="py-2 transition duration-300"
            onClick={() => {
              setLinkChain((prev: any) => {
                return [prev[0], prev[prev.length - 1]];
              });
            }}
          >
            Clear Chain
          </Button>
          <Button
            variant="secondary"
            className="py-2 transition duration-300"
            onClick={() => {
              setLinkChain((prev: any) => {
                return prev.length > 2 ? [...prev.slice(0, -2), prev[prev.length - 1]] : prev;
              });
            }}
          >
            Undo
          </Button>
        </div>
      )}

      {loading && <MoonLoader size={18} color="#fff" />}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div className="relative w-full">
        <div className="absolute top-0">
          <h2 className="flex gap-2 items-center text-lg font-semibold">
            <ClockIcon className="w-4 h-4" />
            Timer
          </h2>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {formatElapsedTime(elapsedTime)}
          </ul>
        </div>

        <div className="w-full max-w-md mx-auto mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        {!loading && !error && (
          <div className="max-h-96 mx-auto w-full max-w-md overflow-x-auto border border-white rounded-lg">
            <table className="min-w-full">
              <tbody>
                {filteredItems.map((item, i) => (
                  <tr
                    key={i}
                    className="cursor-pointer hover:bg-white hover:bg-opacity-10 border-b border-gray-300"
                    onClick={() => {
                      setSearchQuery("");
                      setLinkChain((prev: any) => [
                        ...prev.slice(0, -1),
                        item,
                        prev[prev.length - 1],
                      ])
                    }}
                  >
                    <td className="py-2 px-4 flex items-center">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="rounded-lg mr-4"
                      />
                      <span className="truncate">{item.name}</span>
                      <span className="ml-auto flex items-center gap-1 text-xs opacity-50">
                        {"artist" in item ? <DiscIcon className="w-4 h-4" /> : <MicIcon className="w-4 h-4" />}
                        {"artist" in item ? "Album" : "Artist"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
