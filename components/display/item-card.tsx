import React from "react";
import AlbumCard from "./album-card";
import ArtistCard from "./artist-card";

interface ItemCardProps {
  item: ChainItem | null;
}

const isAlbum = (item: ChainItem): item is Album => {
  return "artist" in item;
};

export default function ItemCard({ item }: ItemCardProps) {
  if (!item) return null;
  return isAlbum(item) ? <AlbumCard album={item} /> : <ArtistCard artist={item} />;
};
