"use client";

import { useState, useEffect } from "react";
import { MoonLoader } from "react-spinners";
import ChainDisplay from "@/components/game/chain-display";
import { fetchAlbums } from "@/services/fetchAlbums";
import { fetchAlbumArtists } from "@/services/fetchAlbumArtists";
import { fetchAlbumAlbum } from "@/services/fetchAlbumAlbum";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DiscIcon, MicIcon } from "lucide-react";

interface GameProps {
  linkChain: ChainItem[];
  setLinkChain: (chain: any) => any;
  onGameOver: () => void;
}

export default function Game({ linkChain, setLinkChain, onGameOver }: GameProps) {
  const [items, setItems] = useState<ChainItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getItems = async () => {
      setLoading(true);
      try {
        const lastItem = linkChain[linkChain.length - 2];
        if ("artist" in lastItem) {
          const fetchedArtists = await fetchAlbumArtists(lastItem.id);
          setItems(fetchedArtists?.sort((a, b) => a.name.localeCompare(b.name)) || []);
        } else {
          const fetchedAlbums = await fetchAlbums(lastItem.id)
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
        return prev.length > 2 ? [...prev.slice(0, -2), prev[prev.length - 1]] : prev
      })
      onGameOver();
    }
  }, [linkChain]);

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
              })}}
            >
            Clear Chain
          </Button>
          <Button
            variant="secondary"
            className="py-2 transition duration-300"
            onClick={() => {
              setLinkChain((prev: any) => {
                return prev.length > 2 ? [...prev.slice(0, -2), prev[prev.length - 1]] : prev
              })}}
            >
            Undo
          </Button>
        </div>
      )}

      {loading && <MoonLoader size={18} color="#fff" />}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {!loading && !error && (
        <div className="max-h-96 w-full max-w-md overflow-x-auto border border-white rounded-lg">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={index}
                  className="cursor-pointer hover:bg-white hover:bg-opacity-10 border-b border-gray-300"
                  onClick={() => {
                    setLinkChain((prev: any) => {
                      return [...prev.slice(0, -1), item, prev[prev.length - 1]];
                    });
                  }}
                >
                  <td className="relative py-2 px-4 flex items-center">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="rounded-lg mr-8"
                    />
                    <span className="truncate">{item.name}</span>
                    <div className="absolute right-6 flex items-center gap-1 text-gray-500 text-xs">
                      {"artist" in item ? <DiscIcon className="w-4 h-4" /> : <MicIcon className="w-4 h-4" />}
                      <span>{ "artist" in item ? "Album" : "Artist" }</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
