import { randomInt } from "crypto";
import * as spot from "./spotify.js";
import * as logic from "./logic.js";
import dotenv from "dotenv";
import { start } from "repl";
import { createClient } from '@supabase/supabase-js'

dotenv.config();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PRIVATE_SUPABASE_SERVICE_KEY)

const { error: linkError } = await supabase.from('game_links').delete().neq('link_id', 0)
const seedLinks = async () => {

  const {data: gamesID, error: gamesError} = await supabase.from('daily_game_session').select()
  if (gamesError) {
    console.error("Error fetching game IDs:", gamesError);
    return;
  } else {
    console.log("data gotten ");
  }

  var latest = gamesID[gamesID.length - 1]
  var dailyGameID_init = latest.daily_game_id;
  var date = new Date(latest.date);
  console.log(date)

  for (let i = dailyGameID_init + 1; i <= dailyGameID_init + 100; i++) {
    var genre = await spot.getRandomGenre();
    date.setDate(date.getDate() + 1)
    console.log(genre)
    console.log("Getting Valid Artists")
    var par = 1;
    do
    {
      var artist_ids = await logic.getValidArtistStartEnd(genre.name);
      var start_id = await artist_ids.id1;
      var end_id = await artist_ids.id2;
      par = await artist_ids.par;
    } while(par == 1)

    const linkData = await {
      daily_game_id: i,
      date: date.toISOString(),
      game_mode: "daily",
      start_artist_id: start_id,
      end_artist_id: end_id,
      challenge_link_length: par
    }
    console.log(linkData);

    const { data, error } = await supabase.from('daily_game_session').insert(linkData);
    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Data inserted successfully links:", data);
    }
  }
};

await seedLinks();
