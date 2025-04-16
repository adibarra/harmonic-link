import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from "react";

export type GameState = {
  game_id?: number;
  startArtist?: Artist;
  endArtist?: Artist;
  startTime?: number;
  endTime?: number;
  score?: number;
  startAlbum?: Album;
  endAlbum?: Album;
  linkChain?: ChainItem[];
  userId?: number;
  gameMode?: string;
};

export type GameStateAction =
  | { type: "set_game_id"; id: number }
  | { type: "set_start_artist"; artist: Artist }
  | { type: "set_end_artist"; artist: Artist }
  | { type: "set_start_time"; time: number }
  | { type: "set_end_time"; time: number }
  | { type: "set_score"; score: number }
  | { type: "set_start_album"; album: Album }
  | { type: "set_end_album"; album: Album }
  | { type: "set_link_chain"; linkChain: ChainItem[] }
  | { type: "set_game_mode"; gameMode: string }
  | { type: "restart_game" };

function gameStateReducer(
  state: GameState,
  action: GameStateAction,
): GameState {
  switch (action.type) {
    case "set_game_id":
      return { ...state, game_id: action.id };
    case "set_start_artist":
      return { ...state, startArtist: action.artist };
    case "set_end_artist":
      return { ...state, endArtist: action.artist };
    case "set_start_time":
      return { ...state, startTime: action.time };
    case "set_end_time":
      return { ...state, endTime: action.time };
    case "set_score":
      return { ...state, score: action.score };
    case "set_start_album":
      return { ...state, startAlbum: action.album };
    case "set_end_album":
      return { ...state, endAlbum: action.album };
    case "set_link_chain":
      return { ...state, linkChain: action.linkChain };
    case "set_game_mode":
      return { ...state, gameMode: action.gameMode };
    case "restart_game":
      throw Error("This is not yet implemented");
    default:
      throw Error("Unexpected action in gameStateReducer function" + action);
  }
}

const initialGameState: GameState = {};
const GameStateContext = createContext<GameState>(initialGameState);
const GameStateDispatchContext = createContext<
  Dispatch<GameStateAction> | undefined
>(undefined);

interface GameStateProviderProps {
  children: ReactNode;
}

export default function gameStateProvider({
  children,
}: GameStateProviderProps) {
  const [gameState, dispatch] = useReducer(gameStateReducer, initialGameState);

  return (
    <GameStateContext.Provider value={gameState}>
      <GameStateDispatchContext value={dispatch}>
        {children}
      </GameStateDispatchContext>
    </GameStateContext.Provider>
  );
}

export function useGameState(): GameState {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw Error("useGameState must be used within a gameStateProvider");
  }
  return context;
}

export function useGameStateDispatch(): Dispatch<GameStateAction> {
  const context = useContext(GameStateDispatchContext);
  if (context === undefined) {
    throw Error("useGameStateDispatch must be used within a gameStateProvider");
  }
  return context;
}
