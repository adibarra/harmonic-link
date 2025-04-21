"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useParams, useRouter } from "next/navigation";
import PlayerCard from "@/components/display/player-card";
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
  const [isSigned, setIsSigned] = useState(false);

  const fadeInOut = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 },
  };

  useEffect(() => {
    if (!channel || isConnected) return;

    const initializeUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      var newPlayer: User
      if(user) {
        const identityData = user!.identities![0].identity_data!
        newPlayer = {
          id: myUserID,
          name: identityData.name,
          image: identityData.avatar_url,
          isGuest: false,
        }
        setIsSigned(true);
      }
      else {
         newPlayer = {
          id: myUserID,
          name: `Guest-${Math.floor(Math.random() * 10000)}`,
          image: 'https://developer.spotify.com/images/guidelines/design/icon3.svg',
          isGuest: true,
        };
      }


      sessionStorage.setItem(newPlayer.id, JSON.stringify(newPlayer));
      setMyUser(newPlayer);
      setLoading(false);
      return newPlayer;
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
      className="flex flex-col items-center h-[90vh]"
      {...fadeInOut}
    >
      <div className="w-full flex content-between space-x-4 mb-6">
        <div className="grow flex place-items-start space-x-4">
          <Button
            variant="default"
            className="text-sm"
            onClick={(e) => {
              const btn = e.currentTarget;
              btn.innerText = "Copied!";
              navigator.clipboard.writeText(channel as string);

              setTimeout(() => {
                btn.innerText = "Copy Lobby Code";
              }, 1500);
            }}
          >
            Copy Lobby Code
          </Button>

          <Button
            variant="default"
            className="text-sm"
            onClick={(e) => {
              const btn = e.currentTarget;
              btn.innerText = "Copied!";
              navigator.clipboard.writeText(window.location.href);

              setTimeout(() => {
                btn.innerText = "Copy Lobby Link";
              }, 1500);
            }}
          >
            Copy Lobby Link
          </Button>
        </div>

        <div className="flex place-items-end space-x-4">
          <Button
            variant="destructive"
            className="text-sm"
            onClick={() => {
              sessionStorage.removeItem(myUserID);
              router.push("/");
            }}
          >
            Leave Lobby
          </Button>
        </div>
      </div>

      <div className="w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">
          Players in Lobby ({users.length})
        </h2>

        <div className="flex flex-wrap justify-around gap-4 mb-6">
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
        <div className="h-8" />
      </div>
    </motion.div>
  );
}
