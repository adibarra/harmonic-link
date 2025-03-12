import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export class GameState {
	status: GameStatus = GameStatus.Playing;
	chainItems: ChainItem[] = [];

	constructor(status?: GameStatus, chainItems?: ChainItem[]) {
		if (status) this.status = status;
		if (chainItems) this.chainItems = chainItems;
	}
}

export enum GameStatus {
	Playing,
	Over,
}
