import { NextResponse } from "next/server";
import { getAlbumArtists, getArtistAlbums, getArtist } from "@/lib/spotify";


export const GET = async () => {


   //const data = await getArtist("7tYKF4w9nC0nq9CsPZTHyP");
  const data = await getAlbumArtists("76290XdXVF9rPzGdNRWdCh");

  return  NextResponse.json(data);
}

