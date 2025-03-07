import { randomInt } from "crypto";
import * as spot from "./spotify.js";
import dotenv from "dotenv";
import { start } from "repl";

dotenv.config();

export const verifyArtistPath = async (startID, endID) => {
  // initialize queues
  let artist_queue = [];
  let checked_artists = [];
  let album_queue = [];

  artist_queue.push(startID); // replace with random function
  // final_artist = "" // goal artist
  var goal = endID;
  // loop this eventually
  do
  {
    let curr_artist = artist_queue.shift();
    checked_artists.push(curr_artist);
    let albums = await spot.getArtistAlbums(curr_artist);
    for(let i = 0; i < albums.length; i++)
    {
      album_queue.push(albums[i].id);
    }

    while(album_queue.length > 0 && !artist_queue.includes(goal))
    {
      //console.log("Albums: " + album_queue)
      let curr_album = album_queue.shift();
      let artists = await spot.getAlbumArtists(curr_album);
      // testing this, still getting too many request complaints < - fixed w/ user agent and not using image get for album artists
      for(let i = 0; i < artists.length; i++)
      {
        var a = artists[i].id;
        if(!checked_artists.includes(a))
          artist_queue.push(artists[i].id);
        if(artist_queue.includes(goal))
          break;
      }
    }
    artist_queue = Array.from(new Set(artist_queue));
    //console.log("Artists: " + artist_queue);
  } while(!artist_queue.includes(goal) && checked_artists.length < 100)

  if(artist_queue.includes(goal))
    return true;
  return false;
}

export const getValidArtistStartEnd = async (genre) => {
  // implement random DFS, randomize link 3-8 artists long.
  // initialize stacks
  let artist_queue = [];
  let checked_artists = [];
  let album_queue = [];
  var startID = (await spot.getRandomArtist(genre)).id
  var numConns = randomInt(3,9)
  artist_queue.push(startID); // replace with random function
  // loop this eventually
  for(var n = 0; n < numConns; n++)
  {
    let curr_artist = artist_queue[randomInt(0,artist_queue.length)];
    checked_artists.push(curr_artist);
    artist_queue = [];
    let albums = await spot.getArtistAlbums(curr_artist);
    for(let i = 0; i < albums.length; i++)
    {
      album_queue.push(albums[i].id);
    }

    while(album_queue.length > 0)
    {
      console.log("Albums: " + album_queue)
      let curr_album = album_queue.pop();
      let artists = await spot.getAlbumArtists(curr_album);
      // testing this, still getting too many request complaints < - fixed w/ user agent and not using image get for album artists
      for(let i = 0; i < artists.length; i++)
      {
        var a = artists[i].id;
        if(!checked_artists.includes(a))
          artist_queue.push(artists[i].id);
      }
    }
    artist_queue = Array.from(new Set(artist_queue));
    if(artist_queue.length < 1)
      break;
    console.log("Artists: " + artist_queue);
  }
  if(artist_queue.length < 1)
    return [startID, curr_artist];
  else
    return [startID, artist_queue[randomInt(0,artist_queue.length)]]
}
var m = await getValidArtistStartEnd("alternative")
console.log(m);
