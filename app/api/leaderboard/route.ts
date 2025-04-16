import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
);

export async function POST(request: NextRequest) {
  try {
    const searchParamSchema = z.object({
      game_id: z.coerce.number(),
      start_artist_id: z.string(),
      end_artist_id: z.string(),
      start_time: z.string(),
      end_time: z.string(),
      score: z.coerce.number(),
      start_album_id: z.string(),
      end_album_id: z.string(),
      num_links_made: z.coerce.number(),
      game_mode: z.string(),
    });

    const { searchParams } = new URL(request.url);

    const {
      game_id,
      start_artist_id,
      end_artist_id,
      start_time,
      end_time,
      score,
      start_album_id,
      end_album_id,
      num_links_made,
      game_mode,
    } = searchParamSchema.parse(Object.fromEntries(searchParams.entries()));

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(`User is not signed in`, { status: 400 });
    }
    const user_id = user.id;

    const { error } = await supabase.from("games").upsert({
      game_id: game_id,
      start_artist_id: start_artist_id,
      end_artist_id: end_artist_id,
      start_time: start_time,
      end_time: end_time,
      score: score,
      start_album_id: start_album_id,
      end_album_id: end_album_id,
      num_links_made: num_links_made,
      user_id: user_id,
      game_mode: game_mode,
    });

    if (error) {
      return NextResponse.json(error, {
        status: 500,
      });
    }

    return NextResponse.json(`data successfully upserted`, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
