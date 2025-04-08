"use client";

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { fetchAlbums } from "@/services/fetchAlbums";
import { fetchAlbumArtists } from "@/services/fetchAlbumArtists";
import { fetchArtist } from "@/services/fetchArtist";

import ChainDisplay from "@/components/game/chain-display";
import { Button } from "@/components/ui/button";
import { DiscIcon, MicIcon } from "lucide-react";
import Image from "next/image";
import { MoonLoader } from "react-spinners";

interface GameMultiplayerProps {
  linkChain: ChainItem[];
  setLinkChain: (chain: any) => any;
  onGameOver: () => void;
}

const supabase = createClient();

export default function GameMultiplayer({ linkChain, setLinkChain, onGameOver }: GameMultiplayerProps) {
  const { channel } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const userId = searchParams.get("userId");
  const [myUser, setMyUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [finishedUser, setFinishedUser] = useState<User[]>([]);
  const [broadcastChannel, setBroadcastChannel] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  const [items, setItems] = useState<ChainItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Init presence + channel
  useEffect(() => {
    if (!channel || isConnected) return;

    const initializeUser = async () => {
      const data = sessionStorage.getItem(userId as string);
      if (!data) return router.push("/");

      const parsed = JSON.parse(data);
      setMyUser(parsed);
      return parsed;
    };

    const gameChannel = supabase.channel(`game-room:${channel}`, {
      config: { presence: { key: userId! } },
    });

    gameChannel
      .on("presence", { event: "sync" }, () => {
        const state = gameChannel.presenceState();
        const userList = Object.values(state).map((u: any) => u[0]);
        setUsers(userList);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          const user = await initializeUser();
          await gameChannel.track(user);
          setIsConnected(true);
        }
      });

    setBroadcastChannel(gameChannel);

    return () => {
      gameChannel.unsubscribe();
      setIsConnected(false);
    };
  }, [channel]);

  // Initial artists
  useEffect(() => {
    const setupArtists = async () => {
      try {
        const start = await fetchArtist("4ZAk3yVJdtf1CFnTiG08U3");
        const end = await fetchArtist("2kQnsbKnIiMahOetwlfcaS");
        if (!start || !end) return router.replace("/game/loading");

        setLinkChain([start, end]);
      } catch {
        setError("Error loading artists.");
      }
    };

    setupArtists();
  }, [searchParams]);

  // Fetch next options
  useEffect(() => {
    const getItems = async () => {
      if (linkChain.length < 2) return;

      setLoading(true);
      const last = linkChain[linkChain.length - 2];

      try {
        const data = "artist" in last
          ? await fetchAlbumArtists(last.id)
          : await fetchAlbums(last.id);

        setItems(data?.sort((a, b) => a.name.localeCompare(b.name)) || []);
      } catch {
        setError("Error fetching options.");
      } finally {
        setLoading(false);
      }
    };

    getItems();
  }, [linkChain]);

  // Check for win condition
  useEffect(() => {
    if (linkChain.length < 2) return;

    const last = linkChain[linkChain.length - 1];
    const secondLast = linkChain[linkChain.length - 2];

    if (last.id === secondLast.id && myUser) {
      setFinishedUser((prev) => [...prev, myUser]);

      if (broadcastChannel) {
        broadcastChannel.send({
          type: "broadcast",
          event: "player-finished",
          payload: { user: myUser },
        });
      }
    }
  }, [linkChain]);

  // Listen for other players finishing
  useEffect(() => {
    if (!broadcastChannel) return;

    const sub = broadcastChannel.on("broadcast", { event: "player-finished" }, ({ payload }: { payload: { user: User } }) => {
      if (!finishedUser.some(u => u.id === payload.user.id)) {
        setFinishedUser((prev) => [...prev, payload.user]);
      }
    });

    return () => sub.unsubscribe();
  }, [broadcastChannel, finishedUser]);

  // Check if all finished
  useEffect(() => {
    if (users.length > 0 && finishedUser.length === users.length) {
      router.push("/game/over");
    }
  }, [finishedUser, users]);

  return (
    <div className="flex flex-col items-center space-y-6">
      <ChainDisplay chain={linkChain} />

      {linkChain.length > 1 && (
        <div className="flex space-x-4">
          <Button
            variant="destructive"
            onClick={() =>
              setLinkChain((prev: any) => [prev[0], prev[prev.length - 1]])
            }
          >
            Clear Chain
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              setLinkChain((prev: any) =>
                prev.length > 2
                  ? [...prev.slice(0, -2), prev[prev.length - 1]]
                  : prev
              )
            }
          >
            Undo
          </Button>
        </div>
      )}

      <div className="mt-4">
        <ul className="space-y-1 text-sm text-muted-foreground">
          {users.map((user) => {
            const done = finishedUser.some((u) => u.id === user.id);
            return (
              <li key={user.id}>
                <span className="font-semibold">{user.name}</span>:{" "}
                {done ? "✅ Finished" : "⏳ Playing"}
              </li>
            );
          })}
        </ul>
      </div>

      {loading && <MoonLoader size={18} color="#fff" />}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="max-h-96 w-full max-w-md overflow-x-auto border border-white rounded-lg">
          <table className="min-w-full">
            <tbody>
              {items.map((item, i) => (
                <tr
                  key={i}
                  className="cursor-pointer hover:bg-white hover:bg-opacity-10 border-b border-gray-300"
                  onClick={() =>
                    setLinkChain((prev: any) => [
                      ...prev.slice(0, -1),
                      item,
                      prev[prev.length - 1],
                    ])
                  }
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
                    <span className="ml-auto flex items-center gap-1 text-xs text-gray-400">
                      {"artist" in item ? <DiscIcon className="w-4 h-4" /> : <MicIcon className="w-4 h-4" />}
                      { "artist" in item ? "Album" : "Artist" }
                    </span>
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
