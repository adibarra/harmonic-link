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
    const id = searchParams.get("id");
    const type = searchParams.get("type");
    let responseData;

    switch (type) {
      case "artist":
        console.log("[API] Fetching artist data...");
        if (!id) return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
        responseData = await spot.getArtist(id);
        break;

      case "album":
        console.log("[API] Fetching album data...");
        if (!id) return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
        responseData = await spot.getAlbum(id);
        break;

      case "albumArtists":
        console.log("[API] Fetching album artists data...");
        if (!id) return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
        responseData = await spot.getAlbumArtistsImage(id);
        break;

      case "artistAlbums":
        console.log("[API] Fetching artist albums data...");
        if (!id) return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
        responseData = await spot.getArtistAlbums(id);
        break;

      case 'artistArtist':
        console.log("[API] Fetching artist-artist data...");
        const artistEndless = await logic.getArtistArtist();
        const [artistStart, artistEnd] = await Promise.all([
          spot.getArtist(artistEndless!.id1),
          spot.getArtist(artistEndless!.id2)
        ]);

        responseData = {
          id: `${artistEndless!.id1}-${artistEndless!.id2}`,
          start: artistStart,
          end: artistEnd,
          par: artistEndless!.par,
        } as Challenge;
        break;

      case 'albumAlbum':
        console.log("[API] Fetching album-album data...");
        const albumEndless = await logic.getAlbumAlbum();
        const [albumStart, albumEnd] = await Promise.all([
          spot.getAlbum(albumEndless!.id1),
          spot.getAlbum(albumEndless!.id2)
        ]);

        responseData = {
          id: `${albumEndless!.id1}-${albumEndless!.id2}`,
          start: albumStart,
          end: albumEnd,
          par: albumEndless!.par,
        } as Challenge;
        break;

      case "daily":
        console.log("[API] Fetching daily game session...");
        const { data, error } = await supabase.from("daily_game_session").select("*").eq("date", id);

        if (error || !data?.length) {
          console.error("[API] Error fetching session data:", error);
          return NextResponse.json({ error: "Failed to fetch session data" }, { status: 500 });
        }

        const [dailyStart, dailyEnd] = await Promise.all([
          spot.getArtist(data[0].start_artist_id as string),
          spot.getArtist(data[0].end_artist_id as string)
        ])

        responseData = {
          id: `${data[0].start_artist_id}-${data[0].end_artist_id}`,
          start: dailyStart,
          end: dailyEnd,
          par: data[0].challenge_link_length,
        } as Challenge;
        break;

      default:
        return NextResponse.json({ error: "Bad Request: Check type parameter" }, { status: 400 });
    }

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("[API] Error in GET request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

