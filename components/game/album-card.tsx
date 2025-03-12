"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface AlbumCardProps {
	album: Album;
	size?: number;
}

export default function AlbumCard({ album, size = 64 }: AlbumCardProps) {
	return (
		<Card className="p-2">
			<CardContent className="text-sm text-center">
				<Image src={album.image} alt={album.name} width={size} height={size} />
				<div className="font-bold">{album.name}</div>
				<div className="text-xs opacity-80">{album.artist}</div>
			</CardContent>
		</Card>
	);
}
