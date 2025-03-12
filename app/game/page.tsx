"use client";

import { Suspense } from "react";
import Game from "@/components/game/game";

export default function HarmonicLinks() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Game />
		</Suspense>
	);
}
