"use client";
import { useState } from "react";
import Link from "next/link";

export default function StartScreen() {
	const [mode, setMode] = useState("endless");

	return (
		<main className="w-screen h-screen flex flex-grow bg-black text-white">
			{/* Sidebar for game modes */}
			<aside className="w-60 bg-gray-900 p-4">
				<h2 className="text-lg font-bold mb-4">Game modes</h2>
				<button
					className={`block w-full text-left py-2 px-4 ${
						mode === "endless" ? "bg-purple-500" : ""
					}`}
					onClick={() => setMode("endless")}
				>
					Endless
				</button>
				<button
					className={`block w-full text-left py-2 px-4 mt-2 ${
						mode === "daily" ? "bg-purple-500" : ""
					}`}
					onClick={() => setMode("daily")}
				>
					Daily Puzzle
				</button>
			</aside>

			{/* Main content */}
			<section className="w-full h-full flex flex-col items-center justify-center">
				{/* centered title */}
				<h1 className="text-3xl font-bold mt-20 text-center">
					Connect these two Artists
				</h1>

				<div className="flex justify-center items-center mt-10 space-x-12">
					<div className="relative">
						<img
							src="/images/imagine_dragons.jpeg"
							alt="Imagine Dragons"
							className="w-40 h-40"
							style={{
								position: "relative",
								top: "0",
								left: "0",
								width: "400px",
								height: "auto",
							}}
						/>
						<p className="mt-2 text-center">Imagine Dragons</p>
					</div>
					{/* arrow between album or artist covers */}
					<span className="text-5xl font-bold">→</span>
					<div className="relative">
						<img
							src="/images/taylor-swift.jpeg"
							alt="Taylor Swift"
							className="w-40 h-40"
							style={{
								position: "relative",
								top: "0",
								left: "0",
								width: "400px",
								height: "auto",
							}}
						/>
						<p className="mt-2 text-center">Taylor Swift</p>
					</div>
				</div>
				{/* Play Now Button */}
				<Link href={`/game/${mode}`}>
					<button className="mt-6 px-6 py-2 bg-purple-500 rounded-lg text-white text-lg hover:bg-purple-600">
						Play now!
					</button>
				</Link>
			</section>
		</main>
	);
}
