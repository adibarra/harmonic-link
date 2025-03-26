import {NextResponse} from "next/server"
import * as spot from "@/lib/spotify";

export async function GET(request: Request) {

  try {
    const { searchParams } = new URL(request.url);

    const id = searchParams.get('ID');
    const type = searchParams.get('type');

    switch(type) {

      case 'artist':
        const artistData = await spot.getArtist(id);
        return NextResponse.json(artistData, {status: 200});

      case 'albumArtists':
        const albumArtists = await spot.getAlbumArtistsImage(id);
        return NextResponse.json(albumArtists, {status: 200});

      case 'artistAlbums':
        const albumData = await spot.getArtistAlbums(id)
        return NextResponse.json(albumData, {status: 200});

      default:
        return NextResponse.json(
          { error: 'Invalid type parameter' },
          { status: 400 }
        );

    }



  } catch (error) {
    console.error('Error in get request:' , error);
    return NextResponse.json(
      { error: 'Internal server error' },
      {status: 500}
    );
  }


}
