import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const GAME_STATE_LOCAL_STROAGE_KEY = "GAME_STATE_LOCAL_STROAGE_KEY";
export function saveGameStateToLocalStorage(gameState: GameState) {
	localStorage.setItem(GAME_STATE_LOCAL_STROAGE_KEY, JSON.stringify(gameState));
}

export function getGameStateFromLocalStorage(): GameState {
	const gameStateString = localStorage.getItem(GAME_STATE_LOCAL_STROAGE_KEY);

	if (gameStateString) {
		try {
			const gameState: GameState = JSON.parse(gameStateString);
			// maybe I should have some error checking right here
			return gameState;
		} catch (error: any) {
			console.error("Failed to parse game state from local storage:", error);
		}
	}

	// There was nothing in local storage.
	return { status: GameStatus.Playing, chainItems: [] };
}
