import { createClient } from '@supabase/supabase-js'
import * as spot from '../lib/spotify.js';
import dotenv from "dotenv";
import { randomInt } from "crypto";

dotenv.config();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const genres = ["rock", "soul", "funk", "pop", "garage"];
const entity = ["album", "artist"];
const mode = ["daily", "randomArtist", "randomAlbum"]


function getEntityType(gameMode, index) {
  if (gameMode === "randomAlbum") {
    return entity[(index+2) % 2];
  }
  else {
    return entity[(index+1)%2];
  }

}

//const { error: deleteError } = await supabase.from('games').delete().neq('game_id', 0)
const seedGames = async () => {


  const generatedData = {
    score: randomInt(0, 1000),
    num_links_made: randomInt(1,20)
  }
  var randomEntity = entity[randomInt(0,2)];
  var genre = genres[randomInt(0,3)];
  if (randomEntity === "artist") {
    const data1 = await spot.getRandomArtist(genre);
    const data2 = await spot.getRandomArtist(genre);
    generatedData.start_artist_id = data1.id
    generatedData.end_artist_id = data2.id
    generatedData.game_mode = mode[randomInt(0,2)]
  }
  else {
    const data1 = await spot.getRandomAlbum(genre);
    const data2 = await spot.getRandomAlbum(genre);
    generatedData.start_album_id = data1.id;
    generatedData.end_album_id =data2.id;
    generatedData.game_mode = mode[2]
  };


  const { data, error } = await supabase.from('games').insert([generatedData]);

  if (error) {
    console.error("Error inserting data:", error);
  } else {
    console.log("Data inserted successfully:", data);
  }
};

const { error: linkError } = await supabase.from('game_links').delete().neq('link_id', 0)
const seedLinks = async () => {

  const {data: gameID, error: gamesError} = await supabase.from('games').select()
  if (gamesError) {
    console.error("Error fetching game IDs:", gamesError);
    return;
  } else {
    //console.log("data gotten");
  }

  var genre = genres[randomInt(0,3)];
  var randomIndex = randomInt(0, gamesID.length);
  var gameData = gamesID[randomIndex];
  var randomGameID = gameData.game_id;
  var gameMode = gamesID[randomIndex].game_mode;

  for (let i = 1; i <= randomInt(5,10); i++) {
    var entity = getEntityType(gameMode, i)

    var entityID;
    if (entity === "album")
    {
      const data = await spot.getRandomArtist(genre);
      entityID = data.id;

    } else {
      const data = await spot.getRandomAlbum(genre);

      entityID = data.id;
    }

    const linkData = {
      game_id: randomGameID,
      step_order: i,
      entity_type: entity,
      entity_id: entityID

    }

    const { data, error } = await supabase.from('game_links').insert(linkData);
    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Data inserted successfully links:", data);
    }
  };



};

/*
for(let i = 0; i < 10; i++) {
  await seedGames();
}
*/
for (let i = 0; i < 3; i++){
  await seedLinks();
}


