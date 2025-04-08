"use client";

import { useParams, useSearchParams, useRouter } from 'next/navigation';

import { fetchAlbums } from "@/services/fetchAlbums";
import { fetchAlbumArtists } from "@/services/fetchAlbumArtists";
import { fetchAlbumAlbum } from "@/services/fetchAlbumAlbum";
import { fetchArtist } from "@/services/fetchArtist";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import ChainDisplay from "@/components/game/chain-display";
import { DiscIcon, MicIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MoonLoader } from "react-spinners";

const supabase = createClient();

export default function GamePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [myUser, setMyUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [finishedUser, setFinishedUser] = useState<User[]>([]);
  const [broadcastChannel, setBroadcastChannel] = useState<any>(null);
  const [items, setItems] = useState<ChainItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [linkChain, setLinkChain] = useState<ChainItem[]>([]);

  const { channel } = useParams();
  const [isConnected, setIsConnected] = useState(false);
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const router = useRouter();



  useEffect(() => {
    if (!channel || isConnected) return;

    const initializeUser = async () => {
      const data = sessionStorage.getItem(userId as string);
      if (!data) {
        router.push('/');
      }

      const userData = JSON.parse(data!) as {
        id: string,
        name: string,
        image: string,
        isGuest: boolean
      }


      setMyUser(userData);
      console.log(userData)
      return userData;
    };

    const newChannel = supabase.channel(`game-room:${channel}`, {
      config: {
        presence: {
          key: userId!
        },
      },
    });

    newChannel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = newChannel.presenceState();
        const users = Object.values(presenceState).map((user: any) => user[0]);
        setUsers(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const user = await initializeUser();
          await newChannel.track({
            ...user,

          });
          setIsConnected(true);
        }
      });

    setBroadcastChannel(newChannel);

    return () => {
      newChannel.unsubscribe();
      setIsConnected(false);
    };
  }, [channel]);

  useEffect(() => {
    const fetchArtists = async () => {



      try {
        const fetchedStartArtist = await fetchArtist("4ZAk3yVJdtf1CFnTiG08U3")
        const fetchedEndArtist = await fetchArtist("2kQnsbKnIiMahOetwlfcaS")


        if (!fetchedStartArtist || !fetchedEndArtist) {
          router.replace("/game/loading");
          return;
        }

        setLinkChain([fetchedStartArtist, fetchedEndArtist]);
      } catch (error) {
        setError("Error fetching artist data");
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

        if (myUser) {
          setFinishedUser(prev => [...prev, myUser]);
        }

        //Broadcast you are finished with the game
        if (broadcastChannel) {
          broadcastChannel.send({
            type: 'broadcast',
            event: 'player-finished',
            payload: {
              user: myUser
            }
          });
        }

        if (finishedUser.length == users.length) //Push only if all people have completed their games
          router.push("/game/over");
      }

    }
  }, [linkChain, router, broadcastChannel, myUser]);

  //Listen to a finished user's broadcast
  useEffect(() => {
    if (!broadcastChannel) return;

    const subscription = broadcastChannel.on(
      'broadcast',
      { event: 'player-finished' },
      ({ payload }: { payload: { user: User } }) => {
        console.log(`${payload.user.name} finished!`);
        setFinishedUser(prev => {
          // Don't add duplicates
          if (prev.includes(payload.user)) return prev;
          return [...prev, payload.user];
        });

      }
    );

    return () => {

      subscription.unsubscribe();
    };
  }, [broadcastChannel, router]);

  //Push to game over page
  useEffect(() => {
    if (users.length > 0 && finishedUser.length > 0)
      if (finishedUser.length == users.length)
        router.push("/game/over");


  }, [finishedUser, router]);




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
              })
            }}
          >
            Clear Chain
          </Button>
          <Button
            variant="secondary"
            className="py-2 transition duration-300"
            onClick={() => {
              setLinkChain((prev: any) => {
                return prev.length > 2 ? [...prev.slice(0, -2), prev[prev.length - 1]] : prev
              })
            }}
          >
            Undo
          </Button>
        </div>
      )}
      <div className="flex flex-col items-center space-y-6">

        <ul className="space-y-1">
          {users.map((user) => {
            const isFinished = finishedUser.some((u) => u.id === user.id);
            return (
              <li key={user.id}>
                <span>{user.name}</span>
                <span className="text-sm">{isFinished ? "Finished " : "Playing..."}</span>
              </li>
            );
          })}
        </ul>
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
                      <span>{"artist" in item ? "Album" : "Artist"}</span>
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
