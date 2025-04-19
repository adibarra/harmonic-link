import { NextResponse } from "next/server";
import * as spot from "@/lib/spotify";
import * as logic from "@/lib/logic";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("ID");
    const type = searchParams.get("type");

    if (!id || !type) {
      return NextResponse.json({ error: "Missing ID or type parameter" }, { status: 400 });
    }

    let responseData;

    switch (type) {
      case "artist":
        console.log("[API] Fetching artist data...");
        responseData = await spot.getArtist(id);
        break;

      case "genre":
        console.log("[API] Fetching genre data...");
        responseData = await spot.getRandomGenre();
        break;

      case "albumArtists":
        console.log("[API] Fetching album artists data...");
        responseData = await spot.getAlbumArtistsImage(id);
        break;

      case "artistAlbums":
        console.log("[API] Fetching artist albums data...");
        responseData = await spot.getArtistAlbums(id);
        break;

      case 'artistartist':
        console.log("[API] Fetching artist-artist data...");
        const artistEndless = await logic.getArtistArtist()
        return NextResponse.json(artistEndless, { status: 200 });

      case 'albumalbum':
        console.log("[API] Fetching album-album data...");
        const albumEndless = await logic.getAlbumAlbum();
        return NextResponse.json(albumEndless, { status: 200 });

      case "daily":
        console.log("[API] Fetching daily game session...");
        const { data, error } = await supabase.from("daily_game_session").select("*").eq("date", id);

        if (error || !data?.length) {
          console.error("[API] Error fetching session data:", error);
          return NextResponse.json({ error: "Failed to fetch session data" }, { status: 500 });
        }

        const [start, end] = await Promise.all([
          spot.getArtist(data[0].start_artist_id as string),
          spot.getArtist(data[0].end_artist_id as string)
        ]);

        responseData = { start, end };
        break;

      default:
        return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
    }

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("[API] Error in GET request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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

