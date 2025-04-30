"use server";
import { z } from "zod";

export async function fetchLeaderboard(
  gameId?: string,
): Promise<LeaderboardEntry[] | null> {
  try {
    const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabase_service_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

    if (!supabase_url) {
      throw Error("no supabase url");
    }
    if (!supabase_service_key) {
      throw Error("no supabase service key");
    }

    const responseProf = await fetch(`${supabase_url}/rest/v1/profiles`, {
      headers: {
        apikey: supabase_service_key,
        Authorization: `Bearer ${supabase_service_key}`,
      },
    });
    const rawProfile = await responseProf.json();
    const profileSchema = z.array(
      z.object({
        profile_id: z.coerce.number(),
        id: z.string(),
        email: z.string(),
        display_name: z.string()
      })
    );
    const prof = await profileSchema.parse(rawProfile);

    const profile = new Map(prof.map((p) => [p.id, p.display_name]));

    const response = await fetch(`${supabase_url}/rest/v1/games`, {
      headers: {
        apikey: supabase_service_key,
        Authorization: `Bearer ${supabase_service_key}`,
      },
    });

    const rawLeaderBoardData = await response.json();
    const leaderboardSchema = z.array(
      z.object({
        game_id: z.coerce.number().nullable(),
        start_artist_id: z.string().nullable(),
        end_artist_id: z.string().nullable(),
        start_time: z.string().nullable(),
        end_time: z.string().nullable(),
        score: z.coerce.number(),
        start_album_id: z.string().nullable(),
        end_album_id: z.string().nullable(),
        num_links_made: z.coerce.number(),
        game_mode: z.string(),
        user_id: z.string(),
      }),
    );
    const leaderboardData = leaderboardSchema.parse(rawLeaderBoardData);

    // only return the top 8 players
    const topEntires = leaderboardData
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((entry) => ({
        name: profile.get(entry.user_id) || "guest",
        score: entry.score,
      }));

    return await topEntires;
  } catch (error) {
    console.log(error);
    return null;
  }
}
