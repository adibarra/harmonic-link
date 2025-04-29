"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { MoonLoader } from "react-spinners";
import ChainDisplay from "@/components/display/chain-display";
import { fetchAlbums } from "@/services/fetchAlbums";
import { fetchAlbumArtists } from "@/services/fetchAlbumArtists";
import { Button } from "@/components/ui/button";
import { ClockIcon, DiscIcon, LightbulbIcon, LogOutIcon, MicIcon, RefreshCwIcon, Undo2Icon, UserIcon, XIcon } from "lucide-react";
import { formatElapsedTime } from "@/utils/utils";
import fuzzysort from "fuzzysort";
import { uploadFinishedGameToLeaderBoard } from "@/services/uploadGameToLeaderboard";
import { AnimatePresence } from "motion/react";

interface GameProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onGameOver: () => void;
}

const supabase = createClient();

export default function Game({
  gameState,
  setGameState,
  onGameOver,
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
        const lastItem = gameState.linkChain[gameState.linkChain.length - 2];
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
  }, [gameState.linkChain]);

  useEffect(() => {
    const lastItem = gameState.linkChain[gameState.linkChain.length - 1];
    const secondLastItem = gameState.linkChain[gameState.linkChain.length - 2];

    if (lastItem.id !== secondLastItem.id) return;

    if (gameState.channel && broadcastChannel && myUser) {
      broadcastChannel.send({
        type: "broadcast",
        event: "player-finished",
        payload: { user: myUser },
      });
    } else if (!gameState.channel) {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is 0-based
      const day = String(date.getDate()).padStart(2, "0");
      const gameId = Number(`${year}${month}${day}`);

      uploadFinishedGameToLeaderBoard(
        gameId,
        gameState.linkChain[0].id,
        lastItem.id,
        0,
        elapsedTime,
        calculateScore(gameState.linkChain.length, elapsedTime),
        gameState.linkChain[1]?.id || "",
        secondLastItem.id,
        gameState.linkChain.length,
        "daily",
      );
    }

    setGameState((prevState) => ({
      ...prevState,
      linkChain: prevState.linkChain.length > 2
        ? [...prevState.linkChain.slice(0, -2), prevState.linkChain[prevState.linkChain.length - 1]]
        : prevState.linkChain,
    }));

    onGameOver();
  }, [gameState, broadcastChannel, myUser, elapsedTime]);

  useEffect(() => {
    if (!gameState.channel || isConnected) return;

    const initializeMultiplayer = async () => {
      const userId = searchParams.get("userId");
      const userData = sessionStorage.getItem(userId!);
      if (!userData) return router.push("/");

      const user = JSON.parse(userData);
      setMyUser(user);

      const gameChannel = supabase.channel(`game-room:${gameState.channel}`, {
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
  }, [gameState.channel]);

  useEffect(() => {
    if (!gameState.channel || !broadcastChannel) return;

    broadcastChannel.on(
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
  }, [gameState, broadcastChannel]);

  useEffect(() => {
    setFilteredItems(
      searchQuery.trim() === ""
        ? items
        : fuzzysort.go(searchQuery, items, { key: "name" }).map((r) => r.obj),
    );
  }, [searchQuery, items]);

  const calculateScore = (links: number, time: number) => {
    const time_factor = time < 300 ? 1 - time / 300 + 0.1 : 0.1;
    const par = gameState.challenge?.par ?? 0;
    let scored = Math.floor((10000 - 1000 * (links - par)) * time_factor);
    return scored < 0 ? 0 : scored;
  };

  return (
    <AnimatePresence>
      <div className="flex flex-col items-center space-y-6">
        <ChainDisplay chain={gameState.linkChain} />

        {gameState.linkChain.length > 1 && (
          <div className="flex items-center space-x-6">
            <Button
              className="w-full flex-row gap-2 justify-center items-center"
              variant="secondary"
              onClick={() =>
                setGameState((prevState) => ({
                  ...prevState,
                  linkChain: prevState.linkChain.length > 2
                    ? [...prevState.linkChain.slice(0, -2), prevState.linkChain[prevState.linkChain.length - 1]]
                    : prevState.linkChain,
                }))
              }
            >
              <Undo2Icon className="w-4 h-4" />
              Undo
            </Button>
            <Button
              className="w-full flex-row gap-2 justify-center items-center"
              variant="destructive"
              onClick={() =>
                setGameState((prevState) => ({
                  ...prevState,
                  linkChain: [prevState.linkChain[0], prevState.linkChain[prevState.linkChain.length - 1]],
                }))
              }
            >
              <XIcon className="w-4 h-4" />
              Clear Chain
            </Button>
          </div>
        )}

        <div className="relative w-[50vw]">
          <div className="w-full max-w-md mx-auto mb-4">
            <div className="w-[160px] absolute top-0 left-0">
              <h2 className="flex gap-2 items-center text-lg font-semibold">
                <ClockIcon className="w-4 h-4" />
                Timer
              </h2>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                {formatElapsedTime(elapsedTime).split(" ").map((part, index) => {
                  const cleaned = part.replace(/[^0-9a-zA-Z]/g, "");
                  const match = cleaned.match(/^(\d+)([a-zA-Z]+)$/);
                  if (!match) return <span key={index}>{part} </span>;
                  const [, number, unit] = match;
                  return (
                    <span key={index}>
                      <span className="font-medium text-white/80">{number}</span>
                      {unit}
                      {part.endsWith(",") && ","}{" "}
                    </span>
                  );
                })}
                </li>
              </ul>

              <h2 className="flex gap-2 items-center text-lg font-semibold mt-4">
                <LightbulbIcon className="w-4 h-4" />
                Hint
              </h2>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  This path can be completed in&nbsp;
                  <span className="font-medium text-white/80">
                    {gameState.challenge!.par}
                  </span>
                  &nbsp;link{gameState.challenge!.par > 1 ? 's' : ''}.
                </li>
              </ul>

              {gameState.channel && (
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

              <div className="mt-6">
                {!gameState.channel && gameState.challenge!.type === 'random' && (
                  <ul className="space-y-1 text-sm text-muted-foreground mt-2">
                    <li>
                      <Button
                        className="w-full flex-row gap-2 justify-center items-center"
                        variant="secondary"
                        onClick={() => {
                          setGameState((prevState) => ({
                            ...prevState,
                            status: "waiting",
                            linkChain: [],
                            challenge: null,
                          }));
                        }}
                      >
                        <RefreshCwIcon className="w-4 h-4" />
                        New Challenge
                      </Button>
                    </li>
                  </ul>
                )}

                {gameState.channel && gameState.challenge!.type === 'random' && (
                  <ul className="space-y-1 text-sm text-muted-foreground mt-2">
                    <li>
                      <Button
                        className="w-full flex-row gap-2 justify-center items-center"
                        variant="destructive"
                        onClick={() => {
                          broadcastChannel?.unsubscribe();
                          router.push('/play');
                        }}
                      >
                        <LogOutIcon className="w-4 h-4" />
                        Leave Game
                      </Button>
                    </li>
                  </ul>
                )}

                {!gameState.channel && (
                  <ul className="space-y-1 text-sm text-muted-foreground mt-2">
                    <li>
                      <Button
                        className="w-fit flex-row gap-2 justify-center items-center"
                        variant="destructive"
                        onClick={() => {
                          router.push('/play');
                        }}
                      >
                        <LogOutIcon className="w-4 h-4" />
                        End Game
                      </Button>
                    </li>
                  </ul>
                )}
              </div>
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
            <div className="max-h-96 mx-auto w-full max-w-md overflow-x-hidden border border-white rounded-lg">
              <table className="w-full table-auto">
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-sm text-gray-500">
                        NO RESULTS
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item, i) => (
                      <tr
                        key={i}
                        className="cursor-pointer hover:bg-white hover:bg-opacity-10 border-b border-white"
                        onClick={() => {
                          setSearchQuery("");
                          setGameState((prevState) => ({
                            ...prevState,
                            linkChain: [...prevState.linkChain.slice(0, -1), item, prevState.linkChain[prevState.linkChain.length - 1]],
                          }));
                        }}
                      >
                        <td className="flex items-center border-r border-white">
                        <img
                            className="mx-4 my-2 w-[48px] h-[48px] rounded-lg object-cover"
                            src={item.image}
                            alt={item.name}
                          />
                          <span className="">{item.name}</span>
                          <span className="ml-auto mr-4 flex items-center gap-1 text-xs opacity-50">
                            {"artist" in item ? <DiscIcon className="w-4 h-4" /> : <MicIcon className="w-4 h-4" />}
                            {"artist" in item ? "Album" : "Artist"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
}
