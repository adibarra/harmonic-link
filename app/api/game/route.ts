import { NextResponse } from "next/server"
import * as spot from "@/lib/spotify";
import * as logic from "@/lib/logic";
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string)

export async function GET(request: Request) {

  try {
    const { searchParams } = new URL(request.url);

    const id = searchParams.get('ID');
    const type = searchParams.get('type');

    switch (type) {

      case 'artist':
        const artistData = await spot.getArtist(id);
        return NextResponse.json(artistData, { status: 200 });

      case 'albumArtists':
        const albumArtists = await spot.getAlbumArtistsImage(id);
        return NextResponse.json(albumArtists, { status: 200 });

      case 'artistAlbums':
        const albumData = await spot.getArtistAlbums(id)
        return NextResponse.json(albumData, { status: 200 });

      case 'daily':
        console.log("hello")
        const { data, error } = await supabase.from('daily_game_session').select('*').eq('date', id)
        console.log(data)

        if (error) {
          console.log("wtf")
          //console.error("Error fetching session data:", error);
          return NextResponse.json(
            { error: "Failed to fetch session data" },
            { status: 500 }
          );
        }
        else {
          const startArtist = await spot.getArtist(data[0].start_artist_id as string)
          const endArtist = await spot.getArtist(data[0].end_artist_id as string)

          const responseData = {
            startArtist,
            endArtist
          }
          return NextResponse.json(responseData, { status: 200 });

        }

      default:
        return NextResponse.json(
          { error: 'Invalid type parameter' },
          { status: 400 }
        );

    }



  } catch (error) {
    console.error('Error in get request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/*
// this breaks the build, uncomment when ready to use
export async function ENDLESS_INIT(request: Request) {

  try {
    const { searchParams } = new URL(request.url);

    const id = searchParams.get('ID'); // ID = genre
    const type = searchParams.get('type');

    switch (type) {

      case 'artist-artist':
        const artist = await logic.getValidArtistStartEnd(id);
        return NextResponse.json(artist, { status: 200 });

      case 'album-album':
        const album = await logic.getValidAlbumStartEnd(id);
        return NextResponse.json(album, { status: 200 });


      default:
        return NextResponse.json(
          { error: 'Invalid type parameter' },
          { status: 400 }
        );

    }



  } catch (error) {
    console.error('Error in get request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
 */
