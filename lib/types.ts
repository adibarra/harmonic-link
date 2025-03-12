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

type ChainItem = Artist | Album;

enum GameStatus {
	Playing,
	Over,
}

class GameState {
	status: GameStatus = GameStatus.Playing;
	chainItems: ChainItem[] = [];

	constructor(status?: GameStatus, chainItems?: ChainItem[]) {
		if (status) this.status = status;
		if (chainItems) this.chainItems = chainItems;
	}
}
