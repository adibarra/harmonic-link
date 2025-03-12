"use client";

import { Button } from "@/components/ui/button";
import ArtistCard from "@/components/game/artist-card";
import ChainDisplay from "@/components/game/chain-display";
import { Card } from "../ui/card";

interface GameOverScreenProps {
	startArtist: Artist;
	endArtist: Artist;
	linkChain: ChainItem[];
	score: number;
	onRestart: () => void;
}

const fakeLeaderboard = [
	{ name: "Player1", score: 100 },
	{ name: "Player2", score: 90 },
	{ name: "Player3", score: 80 },
	{ name: "Player4", score: 70 },
	{ name: "Player5", score: 60 },
];

export default function GameOverScreen({
	startArtist,
	endArtist,
	linkChain,
	score,
	onRestart,
}: GameOverScreenProps) {
	useEffect(() => {
		/*
		const getItems = async () => {
			if (linkChain.length === 0) return;
			setLoading(true);
			try {
				const lastItem = linkChain[linkChain.length - 1];
				if ("artist" in lastItem) {
					const fetchedArtists = await fetchAlbumArtists(lastItem.id);
					setItems(fetchedArtists || []);
				} else {
					const fetchedAlbums = await fetchAlbums(lastItem.id);
					setItems(fetchedAlbums || []);
				}
				setLoading(false);
			} catch (error) {
				setError("Error fetching data");
				setLoading(false);
			}
		};
        */
	}, [linkChain]);

	return (
		<div className="flex flex-col items-center p-6 space-y-6 h-[90vh] text-white">
			<h1 className="text-4xl font-bold">Game Over</h1>
			<p className="text-xl">Your final score: {score}</p>
			<div className="flex items-center space-x-6">
				<ArtistCard artist={startArtist} />
				<span className="text-2xl">➡</span>
				{/* this needs work */}
				<ChainDisplay
					chain={linkChain}
					hideQuestionMark={true}
					fullChain={false}
				/>
				<span className="text-2xl">➡</span>
				<ArtistCard artist={endArtist} />
			</div>
			<Button onClick={onRestart} className="mt-4 px-6 py-3 rounded">
				Restart Game
			</Button>
			<Card className="w-full flex flex-col">
				<h2 className="p-4 text-2xl font-bold">Leaderboard</h2>
				<ul className="rounded-lg p-4 pt-0 space-y-2">
					{fakeLeaderboard.map((entry, index) => (
						<li
							key={index}
							className="flex border-b border-white border-opacity-10"
						>
							<span>{entry.name}</span>
							<span className="flex-1" />
							<span>{entry.score} points</span>
						</li>
					))}
				</ul>
			</Card>
		</div>
	);
}
