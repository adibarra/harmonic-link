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

interface GameState {
	stats: GameStatus;
	chainItems: ChainItem[];
}
