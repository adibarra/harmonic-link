import GameStateProvider from "@/components/game/game-state-provider";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <GameStateProvider>{children}</GameStateProvider>;
}
