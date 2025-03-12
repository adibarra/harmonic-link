"use client";

import { useRouter } from "next/navigation";
import GameOverScreen from "@/components/game/game-over";
import { useLocalStorage } from "react-use";
import { GAME_STATE_LOCAL_STROAGE_KEY } from "@/lib/localStorage";
import { GameState } from "@/lib/utils";

export default function GameOverPage() {
	const [gameState, setGameState] = useLocalStorage<GameState>(
		GAME_STATE_LOCAL_STROAGE_KEY,
	);
	const router = useRouter();

	const startArtist = gameState?.chainItems[0] || {
		id: "1",
		name: "Imagine Dragons",
		image: "https://i.scdn.co/image/ab67616100005174ab47d8dae2b24f5afe7f9d38",
	};

	const endArtist = gameState?.chainItems[-1] || {
		id: "2",
		name: "Taylor Swift",
		image: "https://i.scdn.co/image/ab67616100005174e672b5f553298dcdccb0e676",
	};

	const linkChain = gameState?.chainItems || [
		{
			id: "a1",
			name: "LOOM",
			artist: "Imagine Dragons",
			image: "https://placehold.co/150/png",
		},
		{
			id: "a2",
			name: "Loosing",
			artist: "Groove Chorus",
			image: "https://placehold.co/150/png",
		},
		{
			id: "a3",
			name: "Am I Still Dreaming?",
			artist: "Loose Room",
			image: "https://placehold.co/150/png",
		},
	];

	const score = 42;

	const handleRestart = () => {
		console.log("Restarting game...");
		setGameState(new GameState());
		router.back();
	};

	return (
		<GameOverScreen
			startArtist={startArtist}
			endArtist={endArtist}
			linkChain={linkChain}
			score={score}
			onRestart={handleRestart}
		/>
	);
}
