"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { MoonLoader } from "react-spinners";
import ChainDisplay from "@/components/display/chain-display";
import { fetchAlbums } from "@/services/fetchAlbums";
import { fetchAlbumArtists } from "@/services/fetchAlbumArtists";
import { Button } from "@/components/ui/button";
import { ClockIcon, DiscIcon, MicIcon, UserIcon } from "lucide-react";
import { formatElapsedTime } from "@/utils/utils";
import fuzzysort from "fuzzysort";
import { uploadFinishedGameToLeaderBoard } from "@/services/uploadGameToLeaderboard";

interface GameProps {
  linkChain: ChainItem[];
  par: number;
  setLinkChain: (chain: any) => void;
  onGameOver: () => void;
  channel?: string;
}

const supabase = createClient();

export default function Game({
  linkChain,
  par,
  setLinkChain,
  onGameOver,
  channel,
}: GameProps) {
  const [items, setItems] = useState<ChainItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ChainItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const searchParams = useSearchParams();
  const router = useRouter();
  const [myUser, setMyUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [finishedUsers, setFinishedUsers] = useState<User[]>([]);
  const [broadcastChannel, setBroadcastChannel] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const lastItem = linkChain[linkChain.length - 2];
        const fetcher = "artist" in lastItem ? fetchAlbumArtists : fetchAlbums;
        const data = await fetcher(lastItem.id);
        setItems(data?.sort((a, b) => a.name.localeCompare(b.name)) || []);
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, [linkChain]);

  useEffect(() => {
    const lastItem = linkChain[linkChain.length - 1];
    const secondLastItem = linkChain[linkChain.length - 2];

    if (lastItem.id !== secondLastItem.id) return;

    if (channel && broadcastChannel && myUser) {
      broadcastChannel.send({
        type: "broadcast",
        event: "player-finished",
        payload: { user: myUser },
      });
    } else if (!channel) {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is 0-based
      const day = String(date.getDate()).padStart(2, "0");
      const gameId = Number(`${year}${month}${day}`);

      uploadFinishedGameToLeaderBoard(
        gameId,
        linkChain[0].id,
        lastItem.id,
        0,
        elapsedTime,
        calculateScore(linkChain.length, elapsedTime),
        linkChain[1]?.id || "",
        secondLastItem.id,
        linkChain.length,
        "daily",
      );
    }

    setLinkChain((prev: ChainItem[]) =>
      prev.length > 2 ? [...prev.slice(0, -2), prev[prev.length - 1]] : prev,
    );
    onGameOver();
  }, [linkChain, channel, broadcastChannel, myUser, elapsedTime]);

  useEffect(() => {
    if (!channel || isConnected) return;

    const initializeMultiplayer = async () => {
      const userId = searchParams.get("userId");
      const userData = sessionStorage.getItem(userId!);
      if (!userData) return router.push("/");

      const user = JSON.parse(userData);
      setMyUser(user);

      const gameChannel = supabase.channel(`game-room:${channel}`, {
        config: { presence: { key: userId! } },
      });

      gameChannel
        .on("presence", { event: "sync" }, () => {
          const state = gameChannel.presenceState();
          setUsers(Object.values(state).map((u: any) => u[0]));
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            await gameChannel.track(user);
            setIsConnected(true);
          }
        });

      setBroadcastChannel(gameChannel);
      return () => {
        gameChannel.unsubscribe();
        setIsConnected(false);
      };
    };

    initializeMultiplayer();
  }, [channel]);

  useEffect(() => {
    if (!channel || !broadcastChannel) return;

    const subscription = broadcastChannel.on(
      "broadcast",
      { event: "player-finished" },
      ({ payload }: { payload: { user: User } }) => {
        setFinishedUsers((prev) =>
          prev.some((u) => u.id === payload.user.id)
            ? prev
            : [...prev, payload.user],
        );
      },
    );

    return () => subscription.unsubscribe();
  }, [channel, broadcastChannel]);

  useEffect(() => {
    setFilteredItems(
      searchQuery.trim() === ""
        ? items
        : fuzzysort.go(searchQuery, items, { key: "name" }).map((r) => r.obj),
    );
  }, [searchQuery, items]);

  const calculateScore = (links: number, time: number) => {
    var time_factor = 0;
    if(time < 300)
      time_factor = 1 - (time/300) + 0.1
    else
      time_factor = 0.1
    var scored = Math.floor((10000 - 1000*(links - par)) * time_factor)
    if(scored < 0)
        scored = 0
    return scored;
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <ChainDisplay chain={linkChain} />

      {linkChain.length > 1 && (
        <div className="flex items-center space-x-6">
          <Button
            variant="destructive"
            onClick={() =>
              setLinkChain([linkChain[0], linkChain[linkChain.length - 1]])
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
                  : prev,
              )
            }
          >
            Undo
          </Button>
        </div>
      )}

      <div className="relative w-[50vw]">
        <div className="w-full max-w-md mx-auto mb-4">
          <div className="absolute top-0 left-0">
            <h2 className="flex gap-2 items-center text-lg font-semibold">
              <ClockIcon className="w-4 h-4" />
              Timer
            </h2>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {formatElapsedTime(elapsedTime)}
            </ul>

            {channel && (
              <>
                <h2 className="flex gap-2 items-center text-lg font-semibold mt-4">
                  <UserIcon className="w-4 h-4" />
                  Players
                </h2>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {users.map((user) => (
                    <li key={user.id}>
                      <span className="font-semibold">
                        {user.id === myUser?.id ? "You" : user.name}
                      </span>
                      :{" "}
                      {finishedUsers.some((u) => u.id === user.id)
                        ? "✅"
                        : "⏳"}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <input
            type="text"
            placeholder="Type to filter results"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-white rounded-lg focus:outline-none focus:ring focus:ring-blue-500 bg-transparent"
          />
        </div>

        {(loading || error) && (
          <div className="w-full flex justify-center items-center h-48">
            {loading && <MoonLoader size={18} color="#fff" />}
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        )}

        {!loading && !error && (
          <div className="max-h-96 mx-auto w-full max-w-md overflow-x-auto border border-white rounded-lg">
            <table className="min-w-full">
              <tbody>
                {filteredItems.map((item, i) => (
                  <tr
                    key={i}
                    className="cursor-pointer hover:bg-white hover:bg-opacity-10 border-b border-white"
                    onClick={() => {
                      setSearchQuery("");
                      setLinkChain((prev: any) => [
                        ...prev.slice(0, -1),
                        item,
                        prev[prev.length - 1],
                      ]);
                    }}
                  >
                    <td className="py-2 px-4 flex items-center">
                      <img
                        className="rounded-lg mr-4"
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                      />
                      <span className="truncate">{item.name}</span>
                      <span className="ml-auto flex items-center gap-1 text-xs opacity-50">
                        {"artist" in item ? (
                          <DiscIcon className="w-4 h-4" />
                        ) : (
                          <MicIcon className="w-4 h-4" />
                        )}
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
