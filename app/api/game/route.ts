import {NextResponse} from "next/server"
import * as spot from "@/lib/spotify";

export async function GET(request: Request) {

  try {
    const { searchParams } = new URL(request.url);

    const id = searchParams.get('ID');
    const type = searchParams.get('type');

    if (type === 'artist') {
      const artistData = await spot.getArtist(id);
      return NextResponse.json(artistData);
    }
    else if (type === 'albumArtists') {
      const albumData = await spot.getAlbumArtists(id);
      return NextResponse.json(albumData);
    }
    else if (type === 'artistAlbums') {
      const albumData = await spot.getArtistAlbums(id);
      return NextResponse.json(albumData);
    }
  } catch (error) {
    console.error('Error in get request:' , error);
    return NextResponse.json(
      { error: 'Internal server error' },
      {status: 500}
    );
  }


}
