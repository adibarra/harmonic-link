"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useParams, useRouter } from "next/navigation";
import PlayerCard from "@/components/game/player-card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { motion } from "motion/react";

const myUserID = uuidv4();
const supabase = createClient();

export default function Lobby() {
  const { channel } = useParams();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [myUser, setMyUser] = useState<User | null>(null);
  const [broadcastChannel, setBroadcastChannel] = useState<any>(null);
  const [confirmedParticipants, setConfirmedParticipants] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const fadeInOut = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 },
  };

  useEffect(() => {
    if (!channel || isConnected) return;

    const initializeUser = async () => {
      const newUser: User = {
        id: myUserID,
        name: `Guest-${Math.floor(Math.random() * 10000)}`,
        image: 'https://i.scdn.co/image/ab6775700000ee85b30fb73ddc12801c51b61f8e',
        isGuest: true,
      };

      sessionStorage.setItem(newUser.id, JSON.stringify(newUser));
      setMyUser(newUser);
      setLoading(false);
      return newUser;
    };

    const channelInstance = supabase.channel(`game-room:${channel}`, {
      config: { presence: { key: myUserID } },
    });

    channelInstance
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channelInstance.presenceState();
        const activeUsers = Object.values(presenceState).map((user: any) => user[0]);
        setUsers(activeUsers);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const user = await initializeUser();
          await channelInstance.track(user);
          setIsConnected(true);
        }
      });

    setBroadcastChannel(channelInstance);

    return () => {
      channelInstance.unsubscribe();
      setIsConnected(false);
    };
  }, [channel]);

  useEffect(() => {
    if (!broadcastChannel) return;

    const confirmSub = broadcastChannel.on('broadcast', { event: 'confirm' }, ({ payload }: { payload: { userId: string } }) => {
      setConfirmedParticipants((prev) =>
        prev.includes(payload.userId) ? prev : [...prev, payload.userId]
      );
    });

    const startSub = broadcastChannel.on('broadcast', { event: 'start' }, ({ payload }: { payload: { participants: string[] } }) => {
      if (payload.participants.includes(myUserID)) {
        router.push(`/play/lobby/${channel}/start?userId=${myUserID}`);
      }
    });

    return () => {
      confirmSub.unsubscribe();
      startSub.unsubscribe();
    };
  }, [broadcastChannel]);

  const handleReady = () => {
    if (!broadcastChannel || users.length < 2) return;

    setConfirmedParticipants((prev) => [...prev, myUserID]);

    broadcastChannel.send({
      type: 'broadcast',
      event: 'confirm',
      payload: { userId: myUserID, channel },
    });

    const allConfirmed = users.every(
      (user) => confirmedParticipants.includes(user.id) || user.id === myUserID
    );

    if (allConfirmed) {
      broadcastChannel.send({
        type: 'broadcast',
        event: 'start',
        payload: { participants: users.map((u) => u.id), channel },
      });

      router.push(`/play/lobby/${channel}/start?userId=${myUserID}`);
    }
  };

  if (!channel) {
    return <div>Loading channel...</div>;
  }

  if (loading || !myUser) {
    return (
      <motion.div
        className="flex justify-center items-center h-screen"
        {...fadeInOut}
      >
        <p>Loading lobby {channel}...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="p-6 flex flex-col items-center space-y-6 h-[90vh]"
      {...fadeInOut}
    >
      <h1 className="text-3xl font-bold mb-6">Lobby: {channel}</h1>

      <div className="w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">
          Players in Lobby ({users.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {users.map((user) => (
            <PlayerCard key={user.id} user={user} you={user.id === myUserID} />
          ))}
        </div>

        {users.length >= 2 ? (
          <div className="flex flex-col items-center space-y-4">
            <Button
              onClick={handleReady}
              className="px-6 py-3 text-lg"
              disabled={confirmedParticipants.includes(myUserID)}
            >
              {confirmedParticipants.includes(myUserID)
                ? 'Waiting for others...'
                : 'Ready'}
            </Button>
            {confirmedParticipants.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {confirmedParticipants.length}/{users.length} players ready
              </p>
            )}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Waiting for more players... (Need at least 2)
          </p>
        )}
      </div>
    </motion.div>
  );
}
