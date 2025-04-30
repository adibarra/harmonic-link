"use server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string,
);

const leaderboardEntriesSchema = z.array(
  z.object({
    score: z.number(),
    display_name: z.object({ display_name: z.string() }),
    game_mode: z.string(),
  }),
);

const log = "SERVICE FETCH GAMES";

export async function fetchGames(
  gameId: number,
  gameMode: string,
): Promise<LeaderboardEntry[] | null> {
  try {
    console.log(log, "called");
    console.log(log, "gameId", gameId);
    console.log(log, "gameMode", gameMode);

    const { data, error } = await supabase
      .from("games")
      .select(
        `
        game_id,
        score,
        game_mode,
        display_name:profiles!user_id(
            display_name
        )`,
      )
      .eq("game_id", gameId)
      .eq("game_mode", gameMode);

    console.log(log, "data", data);
    console.log(log, "error", error);

    if (error) {
      throw error;
    }

    const leaderboardEntries = leaderboardEntriesSchema
      .parse(data)
      .map((entry) => ({
        displayName: entry.display_name.display_name,
        gameMode: entry.game_mode,
        score: entry.score,
      }));

    console.log(log, "leaderboard entries", leaderboardEntries);
    return leaderboardEntries;
  } catch (error) {
    console.log(log, "returned error", error);
    return null;
  }
}
