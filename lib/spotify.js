import dotenv from "dotenv";
import fetch from "node-fetch";

const getAccessToken = async () => {
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!refresh_token) {
    throw new Error("Missing SPOTIFY_REFRESH_TOKEN");
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });
  const { access_token} = await response.json();

  return access_token;
//This returns the access token required in all spotify api endpoints

};


//Returns information about an artist
export const getArtist = async (artistId) => {
  const access_token = await getAccessToken();

  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}`,
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.statusText}`);
  }
  const data = await response.json();
  const artist = {
    id: data.id,
    name: data.name,
    image: data.images[0]?.url,            //Potentially multiple images
    href: data.external_urls.spotify,
    popularity: data.popularity
  };
  return artist;

}

export const getAlbum = async (albumId) => {
  const access_token = await getAccessToken();

  const response = await fetch(
    `https://api.spotify.com/v1/albums/${albumId}`,
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.statusText}`);
  }
  const data = await response.json();
  const album = {
    id: data.id,
    name: data.name,
    image: data.images[0]?.url,
    href: data.external_urls.spotify
  };

  return album;
}


//Returns information about the albums the artist is featured on
export const getArtistAlbums = async (artistId) => {
  const access_token = await getAccessToken();

  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/albums`,
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  if (!response.ok) {
    if(response.status == 500)
    {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return -1;
    }
    throw new Error(`Spotify API error: ${response.statusText}`);
  }
  const data = await response.json();
  const filteredAlbums = data.items.map(album => ({
    id: album.id,
    name: album.name,
    image: album.images[0]?.url,
    href: album.href,
  }));

  return filteredAlbums;
}


//Returns the lists of artist on an album
export const getAlbumArtists = async (albumID) => {
  const access_token = await getAccessToken();


  const response = await fetch(
    `https://api.spotify.com/v1/albums/${albumID}/tracks`,
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  if (!response.ok) {
    if(response.status == 500)
    {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return -1;
    }
    throw new Error(`Spotify API error: ${response.statusText}`);
  }
  var data;
  try{ // fixes <html> error
    data = await response.json();
  } catch(error) {
    console.log("error in json: " + error);
    return -1;
  }
  const seenArtistIds = new Set();
  const filteredArtists = data.items.flatMap(item =>
    item.artists
      .filter(artist => !seenArtistIds.has(artist.id)) // Filter duplicates
      .map(artist => {
        seenArtistIds.add(artist.id);                 //Add artist to map
        return {
          id: artist.id,
          name: artist.name,
          href: artist.href
        };
      })
  );

/*
 //causes request issues
  const artistData = await Promise.all(
    filteredArtists.map(async (artist) => {
      const artistDetails = await getArtist(artist.id); // Call getArtist for each artist ID to obtain the image
      return {
        ...artist,                 //Has the name, href, and ID
        image: artistDetails.image // Add the image from getArtist
      };
    })
  );
*/

  return filteredArtists;

}

export const getAlbumArtistsImage = async (albumID) => {
  const access_token = await getAccessToken();


  const response = await fetch(
    `https://api.spotify.com/v1/albums/${albumID}/tracks`,
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.statusText}`);
  }
  var data;
  try{ // fixes <html> error
    data = await response.json();
  } catch(error) {
    console.log("error in json: " + error);
    return -1;
  }
  const seenArtistIds = new Set();
  const filteredArtists = data.items.flatMap(item =>
    item.artists
      .filter(artist => !seenArtistIds.has(artist.id)) // Filter duplicates
      .map(artist => {
        seenArtistIds.add(artist.id);                 //Add artist to map
        return {
          id: artist.id,
          name: artist.name,
          href: artist.href
        };
      })
  );


 //causes request issues
  const artistData = await Promise.all(
    filteredArtists.map(async (artist) => {
      const artistDetails = await getArtist(artist.id); // Call getArtist for each artist ID to obtain the image
      return {
        ...artist,                 //Has the name, href, and ID
        image: artistDetails.image // Add the image from getArtist
      };
    })
  );


  return artistData;

}



//Generates and returns a random artist based on the genre given.
export const getRandomArtist = async (genre) => {
  const access_token = await getAccessToken();

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=genre:${genre}&type=artist&limit=20`,
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.statusText}`);
  }

  const data = await response.json();
  const artists = data.artists.items;
  if (artists.length === 0) {
    throw new Error("No artists found for the specified genre.");
  }

  //Select a random Artist from the result
  const randomIndex = Math.floor(Math.random() * artists.length);
  const result = artists[randomIndex];

  //Filter out the data we want
  const artistData = {
    id: result.id,
    name: result.name,
    image: result.images[0]?.url,
    href: result.href
  }
  return artistData;
};


//Generates and returns a random album based on the genre given.
export const getRandomAlbum = async (genre) => {
  const access_token = await getAccessToken();

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=genre:${genre}&type=track&limit=20`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.statusText}`);
  }



  const data = await response.json();
  const albums = data.tracks.items;
  if (albums.length === 0) {
    throw new Error("No albums found for the specified genre.");
  }

  // Select a random album
  const randomIndex = Math.floor(Math.random() * albums.length);
  const randomAlbum = albums[randomIndex];
  //Filter out the data we want
  const albumData = {
    id: randomAlbum.album.id,
    name: randomAlbum.album.name,
    image: randomAlbum.album.images[0]?.url,
    href: randomAlbum.album.href,
  }


  return albumData;
};
