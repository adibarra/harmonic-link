import { randomInt } from "crypto";
import * as spot from "./spotify.js";
import dotenv from "dotenv";
import { start } from "repl";

// the evil list of evil IDs that have no connections. Add to database later.
var chili_list = ["0L8ExT028jH3ddEcZwqJJ5"]

dotenv.config();

export const verifyArtistPath = async (startID, endID) => {
  if(chili_list.includes(startID) || chili_list.includes(endID))
  {
    if(startID == endID)
      return 0;
    return -1;
  }
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
      //console.log("Albums: " + album_queue)
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
    //console.log("Artists: " + artist_queue);
  } while(!artist_queue.includes(goal) && checked_artists.length < 100)

  if(artist_queue.includes(goal))
  {
    a = artist_map.get(goal);
    return {
      id1: a[0],
      id2: a[1],
      size: a[2]
    };
  }
  return -1;
}

export const getValidArtistStartEnd = async (genre, specific_mode) => {
  // implement random DFS, randomize link 2-3 artists long.
  // initialize stacks
  let artist_queue = [];
  let checked_artists = [];
  let album_queue = [];
  if(specific_mode) // if true uses genre as startID
    startID = genre;
  else
    var startID = (await spot.getRandomArtist(genre)).id;

  var numConns = randomInt(2,4);
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
      //console.log("Albums: " + album_queue)
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
    //console.log("Artists: " + artist_queue);
  }
  if(artist_queue.length < 1)
    return {id1: startID, id2: curr_artist, par: checked_artists.length - 1}; // if startID = curr_artist then the artist has no connections, have it restart.
  else
    return {id1: startID, id2: artist_queue[randomInt(0,artist_queue.length)], par: numConns}
}

export const verifyAlbumPath = async (startID, endID) => {
  // initialize queues
  let artist_queue = [];
  let checked_albums = [];
  let album_queue = [];
  let album_map = new Map();
  // add map so length of connection can be added.
  album_map.set(startID, 0)
  album_queue.push(startID);

  var goal = endID;
  do
  {
    let curr_album = album_queue.shift();
    checked_albums.push(curr_album);
    let artlen = album_map.get(curr_album) + 1;
    let artists = await spot.getAlbumArtists(curr_album);
    for(let i = 0; i < artists.length; i++)
    {
      artist_queue.push(artists[i].id);
    }

    while(artist_queue.length > 0 && !album_queue.includes(goal))
    {
      //console.log("Artists: " + artist_queue)
      let curr_artist = artist_queue.shift();
      let albums = await spot.getArtistAlbums(curr_artist);
      // testing this, still getting too many request complaints < - fixed w/ user agent and not using image get for album artists
      for(let i = 0; i < albums.length; i++)
      {
        if(albums[i] != -1) //ignores improper responses
        {
          var a = albums[i].id;
          if(!checked_albums.includes(a))
          {
            album_queue.push(albums[i].id);
            album_map.set(albums[i].id, artlen);
          }
          if(album_queue.includes(goal))
            break;
        }
      }
    }
    album_queue = Array.from(new Set(album_queue));
    //console.log("Albums: " + album_queue);
  } while(!album_queue.includes(goal) && checked_albums.length < 100)

  if(album_queue.includes(goal))
  {
    a = album_map.get(goal);
    return {
      id1: a[0],
      id2: a[1],
      size: a[2]
    };
  }
  return -1;
}

export const getValidAlbumStartEnd = async (genre) => {
  // implement random DFS, randomize link 3-4 albums long.
  // initialize stacks
  var startID = (await spot.getRandomAlbum(genre)).id;
  var startArtists = await spot.getAlbumArtists(startID);
  var startArtistID = await startArtists[randomInt(0,startArtists.length)].id;
  var se = await getValidArtistStartEnd(startArtistID, true);
  var endAlbums = await spot.getArtistAlbums(se.id2);
  var endID = await endAlbums[randomInt(0,endAlbums.length)].id;
  return await { id1: startID, id2: endID, par: se.par + 1};
}

//var m = await getValidArtistStartEnd("alternative", false);
//console.log(m);

//var n = await verifyAlbumPath(m[0], m[1]);
//console.log(n);
