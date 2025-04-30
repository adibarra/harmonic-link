interface Artist {
  id: string;
  name: string;
  image: string;
}

interface Album {
  id: string;
  name: string;
  artist: string;
  image: string;
}

interface User {
  id: string;
  name: string;
  image: string;
  isGuest: boolean;
}

interface Challenge {
  id: string;
  type: "daily" | "random";
  start: ChainItem;
  end: ChainItem;
  par: number;
}

interface GameState {
  challenge: Challenge | null;
  channel: string | null;
  status: "waiting" | "loading" | "playing" | "finished";
  linkChain: ChainItem[];
  score?: number;
  gameId?: number;
}

type ChainItem = Artist | Album;

type LeaderboardEntry = {
  score: number;
  displayName: string;
  gameMode: string;
};
