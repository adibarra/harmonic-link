"use client";

import { useState, useEffect } from "react";
import { MoonLoader } from "react-spinners";
import ArtistCard from "@/components/game/artist-card";
import ChainDisplay from "@/components/game/chain-display";
import { fetchArtistData } from "@/services/fetchArtistData";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { fetchAlbums } from "@/services/fetchAlbums";
import { fetchAlbumArtists } from "@/services/fetchAlbumArtists";
import Image from "next/image";

export default function HarmonicLinks() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [startArtist, setStartArtist] = useState<Artist | null>(null);
  const [endArtist, setEndArtist] = useState<Artist | null>(null);
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
          const fetchedStartArtist = await fetchArtistData(startArtistId);
          const fetchedEndArtist = await fetchArtistData(endArtistId);

          setStartArtist(fetchedStartArtist);
          setEndArtist(fetchedEndArtist);
          setItems((await fetchAlbums(startArtistId)) || []);
        } catch (error) {
          console.error("Error fetching artist data:", error);
        }
      } else {
        router.push("/loading");
      }
    };

    fetchArtists();
  }, [searchParams]);

  useEffect(() => {
    const getItems = async () => {
      if (linkChain.length === 0) return;
      setLoading(true);
      try {
        const lastItem = linkChain[linkChain.length - 1];
        if ("artist" in lastItem) {
          const fetchedArtists = await fetchAlbumArtists(lastItem.id);
          setItems(fetchedArtists || []);
        } else {
          const fetchedAlbums = await fetchAlbums(lastItem.id);
          setItems(fetchedAlbums || []);
        }
        setLoading(false);
      } catch (error) {
        setError("Error fetching data");
        setLoading(false);
      }
    };

    getItems();
  }, [linkChain]);

  const addToChain = async (item: Album | Artist) => {
    setLinkChain((prev) => [...prev, item]);
  };

  return (
    <div className="p-6 flex flex-col items-center space-y-6 h-[90vh]">
      <h1 className="text-3xl font-bold mb-6">Harmonic Links</h1>
      <div className="flex items-center space-x-6">
        {startArtist && <ArtistCard artist={startArtist} />}
        <span className="text-xl">➡</span>
        <ChainDisplay chain={linkChain} />
        <span className="text-xl">➡</span>
        {endArtist && <ArtistCard artist={endArtist} />}
      </div>

      {loading && <MoonLoader size={18} color="#fff" />}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {!loading && !error && (
        <div className="w-full max-w-md overflow-x-auto border border-white rounded-lg">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
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
    </div>
  );
}
