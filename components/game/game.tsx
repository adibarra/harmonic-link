"use client";

import { useState, useEffect } from "react";
import { MoonLoader } from "react-spinners";
import ChainDisplay from "@/components/game/chain-display";
import { useRouter } from "next/navigation";
import { fetchAlbums } from "@/services/fetchAlbums";
import { fetchAlbumArtists } from "@/services/fetchAlbumArtists";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DiscIcon, MusicIcon } from "lucide-react";

interface GameProps {
  start: ChainItem;
  end: ChainItem;
}

export default function Game({ start, end }: GameProps) {
  const router = useRouter();
  const [items, setItems] = useState<ChainItem[]>([]);
  const [linkChain, setLinkChain] = useState<ChainItem[]>([start,end]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getItems = async () => {
      setLoading(true);
      try {
        const lastItem = linkChain[linkChain.length - 2];
        if ("artist" in lastItem) {
          const fetchedArtists = await fetchAlbumArtists(lastItem.id)
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
    if (linkChain.length > 2) {
      const lastItem = linkChain[linkChain.length - 1];
      const secondLastItem = linkChain[linkChain.length - 2];

      if (lastItem.id === secondLastItem.id) {
        router.push("/game/over");
      }
    }
  }, [linkChain, router]);

  return (
    <div className="p-6 flex flex-col items-center space-y-6 h-[90vh]">
      <h1 className="text-3xl font-bold mb-6">Harmonic Links</h1>
      <div className="flex items-center space-x-6">
        <ChainDisplay chain={linkChain} />
      </div>

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
                    setLinkChain((prev) => {
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
                      {"artist" in item ? <DiscIcon className="w-4 h-4" /> : <MusicIcon className="w-4 h-4" />}
                      <span>{ "artist" in item ? "Album" : "Artist" }</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {linkChain.length > 1 && (
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            setLinkChain((prev) => {
              return prev.length > 2 ? [...prev.slice(0, -2), prev[prev.length - 1]] : prev
            })}}
          >
          Undo
        </Button>
      )}
    </div>
  );
}
