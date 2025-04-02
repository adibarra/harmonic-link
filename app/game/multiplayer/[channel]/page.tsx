"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ArtistCard from "@/components/game/artist-card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useParams} from "next/navigation";
import { useRouter } from "next/navigation";
const myUserID = uuidv4();



const supabase = createClient();




type User = {
  id: string;
  name: string;
  image: string;
  isGuest: boolean;
};




export default function Lobby() {
  const { channel } = useParams();
  const [users, setUsers] = useState<User[]>([]);
  const [myUser, setMyUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [broadcastChannel, setBroadcastChannel] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [confirmedParticipants, setConfirmedParticipants] = useState<string[]>([]);


  const router = useRouter();

  useEffect(() => {
    if (!channel || isConnected) return;

    const initializeUser = async () => {
      const userDetails = {
        id: myUserID,
        name: `Guest-${Math.floor(Math.random() * 10000)}`,
        image: "https://i.scdn.co/image/ab6775700000ee85b30fb73ddc12801c51b61f8e",
        isGuest: true,
      };
      setMyUser(userDetails);
      setLoading(false);
      return userDetails;
    };

    const newChannel = supabase.channel(`game-room:${channel}`, {
      config: {
        presence: {
          key: myUserID,
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

  //Handles game confirmation and start
  useEffect(() => {
    if (!broadcastChannel) return;

    const confirmSubscription = broadcastChannel.on(
      'broadcast',
      { event: 'confirm' },
      ({ payload }: { payload: { userId: string } }) => {
        setConfirmedParticipants(prev => {
          // Don't add duplicates
          if (prev.includes(payload.userId)) return prev;
          return [...prev, payload.userId];
        });
      }
    );

    const startSubscription = broadcastChannel.on(
      'broadcast',
      { event: 'start' },
      ({ payload }: { payload: { participants: string[] } }) => {
        if (payload.participants.includes(myUserID)) {
          router.push(`/game/multiplayer/game/${channel}`);
        }
      }
    );

    return () => {
      confirmSubscription.unsubscribe();
      startSubscription.unsubscribe();
    };
  }, [broadcastChannel]);

  const startGame = () => {
    if (!broadcastChannel || users.length < 2) return;

    setConfirmedParticipants(prev => [...prev, myUserID]);
    // Send confirmation
    broadcastChannel.send({
      type: 'broadcast',
      event: 'confirm',
      payload: {
        userId: myUserID,
        channel: channel,
      },
    });

    // Check if all have confirmed
    const allConfirmed = users.every(user =>
      confirmedParticipants.includes(user.id) || user.id === myUserID
    );

    if (allConfirmed) {
      broadcastChannel.send({
        type: 'broadcast',
        event: 'start',
        payload: {
          participants: users.map(u => u.id),
          channel: channel,
        },
      });
      router.push(`/game/multiplayer/game/${channel}`);
    }
  };

  if (!channel) {
    return <div>Loading channel...</div>;
  }

  if (loading || !myUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading lobby {channel}...</p>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col items-center space-y-6 h-[90vh]">
      <h1 className="text-3xl font-bold mb-6">Lobby: {channel}</h1>

      <div className="w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">
          Players in Lobby ({users.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {users.map((user) => (
            <div key={user.id} className="border rounded-lg p-4">
              <ArtistCard
                artist={{
                  id: user.id,
                  name: user.name,
                  image: user.image,
                }}
              />
              <div className="mt-2 text-sm">
                {user.isGuest && (
                  <span className="text-gray-400">
                    {user.id === myUserID ? "You" : "Guest"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {users.length >= 2 ? (
          <div className="flex flex-col items-center space-y-4">
            <Button
              onClick={startGame}
              className="px-6 py-3 text-lg"
              disabled={confirmedParticipants.includes(myUserID)}
            >
              {confirmedParticipants.includes(myUserID)
                ? "Waiting for others..."
                : "Start Game"}
            </Button>
            {confirmedParticipants.length > 0 && (
              <p className="text-sm text-gray-500">
                {confirmedParticipants.length}/{users.length} players ready
              </p>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            Waiting for more players... (Need at least 2)
          </p>
        )}
      </div>
    </div>
  );
}
