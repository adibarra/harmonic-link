"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface SearchDropdownProps {
	albums: Album[];
	onSelect: (album: Album) => void;
}

export default function SearchDropdown({
	albums,
	onSelect,
}: SearchDropdownProps) {
	return (
		<div className="absolute w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-10">
			{albums.map((album, index) => (
				<Button
					key={album.id || index}
					variant="outline"
					className="w-full flex p-2"
					onClick={() => onSelect(album)}
				>
					<div className="flex grow">
						<Image
							src={album.image}
							alt={album.name}
							width={40}
							height={40}
							className="mr-2 p-1"
						/>
						<div className="flex flex-col">
							<div className="font-bold text-left">{album.name}</div>
							<div className="text-xs opacity-80 text-left">{album.artist}</div>
						</div>
					</div>
				</Button>
			))}
		</div>
	);
}
