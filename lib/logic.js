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
  let artist_map = new Map();
  // add map so length of connection can be added.
  artist_map.set(startID, 0)
  artist_queue.push(startID);

  // final_artist = "" // goal artist
  var goal = endID;
  // loop this eventually
  do
  {
    let curr_artist = artist_queue.shift();
    checked_artists.push(curr_artist);
    let artlen = artist_map.get(curr_artist) + 1;
    let albums = await spot.getArtistAlbums(curr_artist);
    for(let i = 0; i < albums.length; i++)
    {
      album_queue.push(albums[i].id);
    }

    while(album_queue.length > 0 && !artist_queue.includes(goal))
    {
      console.log("Albums: " + album_queue)
      let curr_album = album_queue.shift();
      let artists = await spot.getAlbumArtists(curr_album);
      // testing this, still getting too many request complaints < - fixed w/ user agent and not using image get for album artists
      for(let i = 0; i < artists.length; i++)
      {
        if(artists[i] != -1) //ignores improper responses
        {
          var a = artists[i].id;
          if(!checked_artists.includes(a))
          {
            artist_queue.push(artists[i].id);
            artist_map.set(artists[i].id, artlen);
          }
          if(artist_queue.includes(goal))
            break;
        }
      }
    }
    artist_queue = Array.from(new Set(artist_queue));
    console.log("Artists: " + artist_queue);
  } while(!artist_queue.includes(goal) && checked_artists.length < 100)

  if(artist_queue.includes(goal))
    return artist_map.get(goal);
  return -1;
}

export const getValidArtistStartEnd = async (genre) => {
  // implement random DFS, randomize link 3-6 artists long.
  // initialize stacks
  let artist_queue = [];
  let checked_artists = [];
  let album_queue = [];
  var startID = (await spot.getRandomArtist(genre)).id
  var numConns = randomInt(3,7)
  var curr_artist;
  artist_queue.push(startID);
  for(var n = 0; n < numConns; n++)
  {
    curr_artist = artist_queue[randomInt(0,artist_queue.length)];
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
      for(let i = 0; i < artists.length; i++)
      {
        if(a != -1)  //ignores improper responses
        {
          var a = artists[i].id;
          if(!checked_artists.includes(a))
            artist_queue.push(artists[i].id);
        }
      }
    }
    artist_queue = Array.from(new Set(artist_queue));
    if(artist_queue.length < 1)
      break;
    console.log("Artists: " + artist_queue);
  }
  if(artist_queue.length < 1)
    return [startID, curr_artist]; // if startID = curr_artist then the artist has no connections, have it restart.
  else
    return [startID, artist_queue[randomInt(0,artist_queue.length)], numConns]
}


var m = await getValidArtistStartEnd("alternative")
console.log(m);

var n = await verifyArtistPath(m[0], m[1]);
console.log(n);
