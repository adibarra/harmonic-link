"use client";

import { useState, useEffect } from "react";
import { MoonLoader } from "react-spinners";
import ChainDisplay from "@/components/game/chain-display";
import { fetchArtistData } from "@/services/fetchArtistData";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { fetchAlbums } from "@/services/fetchAlbums";
import { fetchAlbumArtists } from "@/services/fetchAlbumArtists";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Game() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<ChainItem[]>([]);
  const [linkChain, setLinkChain] = useState<ChainItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArtists = async () => {
      const startArtistId = searchParams.get("start");
      const endArtistId = searchParams.get("end");

      if (startArtistId && endArtistId) {
        try {
          const [fetchedStartArtist, fetchedEndArtist] = await Promise.all([
            fetchArtistData(startArtistId),
            fetchArtistData(endArtistId),
          ]);

          if (!fetchedStartArtist || !fetchedEndArtist) {
            router.replace("/game/loading");
            return;
          }

          setLinkChain([fetchedStartArtist, fetchedEndArtist]);
        } catch (error) {
          setError("Error fetching artist data");
        }
      } else {
        router.replace("/game/loading");
      }
    };

    fetchArtists();
  }, [searchParams]);

  useEffect(() => {
    const getItems = async () => {
      if (linkChain.length < 2) return;
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
        setLoading(false);
      } catch (error) {
        setError("Error fetching data");
        setLoading(false);
      }
    };

    getItems();
  }, [linkChain]);

  useEffect(() => {
    if (linkChain.length > 1) {
      const lastItem = linkChain[linkChain.length - 1];
      const secondLastItem = linkChain[linkChain.length - 2];

      if (lastItem.id === secondLastItem.id) {
        router.push("/game/over");
      }
    }
  }, [linkChain, router]);

  const addToChain = (newItem: ChainItem) => {
    setLinkChain((prev) => {
      if (prev.length < 2) return prev;
      return [prev[0], ...prev.slice(1, -1), newItem, prev[prev.length - 1]];
    });
  };

  const removeLastFromChain = () => {
    setLinkChain((prev) => {
      if (prev.length <= 2) return prev;
      return [prev[0], ...prev.slice(1, -2), prev[prev.length - 1]];
    });
  };

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
                  onClick={() => addToChain(item)}
                >
                  <td className="py-2 px-4 flex items-center">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="rounded-lg mr-8"
                    />
                    {"artist" in item ? item.name : item.name.toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {linkChain.length > 1 && (
        <Button variant="outline" onClick={removeLastFromChain} className="mt-4">
          Undo
        </Button>
      )}
    </div>
  );
}
