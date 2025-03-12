import { NextResponse } from "next/server";
import { topArtists } from "@/lib/spotify";

export const GET = async () => {
	const data = await topArtists();

	return NextResponse.json(data.artists.items);
};
