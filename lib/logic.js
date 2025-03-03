import * as spot from "./spotify.js";
import dotenv from "dotenv";

dotenv.config();

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// initialize queues
let artist_queue = [];
let checked_artists = [];
let album_queue = [];

artist_queue.push("0TnOYISbd1XYRBk9myaseg"); // replace with random function
// final_artist = "" // goal artist

// loop this eventually
let curr_artist = artist_queue.shift();
checked_artists.push(curr_artist);
let albums = await spot.getArtistAlbums(curr_artist);
for(let i = 0; i < albums.length; i++)
{
  album_queue.push(albums[i].id);
}

while(album_queue.length > 0)
{
  console.log(album_queue)
  let curr_album = album_queue.shift();
  let artists = await spot.getAlbumArtists(curr_album);
  // testing this, still getting too many request complaints < - fixed w/ user agent and not using image get for album artists
  // await delay(500);
  for(let i = 0; i < artists.length; i++)
  {
    artist_queue.push(artists[i].id);
  }
}
artist_queue = Array.from(new Set(artist_queue));
console.log(artist_queue);
