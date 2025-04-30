"use server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string,
);

const log = "SERVICE UPLOAD GAME";

export async function uploadGame(
  gameId: number,
  gameMode: string,
  score: number,
  userId: string,
): Promise<null> {
  try {
    console.log(log, "called");

    const { error } = await supabase.from("games").upsert([
      {
        game_id: gameId,
        game_mode: gameMode,
        score: score,
        user_id: userId,
      },
    ]);

    console.log(log, "error", error);

    if (error) {
      throw error;
    }

    return null;
  } catch (error) {
    console.log(log, "returning error", error);
    return null;
  }
}
