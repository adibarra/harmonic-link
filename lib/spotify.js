

const getAccessToken = async () => {
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!refresh_token) {
    throw new Error("Missing SPOTIFY_REFRESH_TOKEN");
  }


  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
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
    href: data.external_urls.spotify
  };

  return artist;

}


//Returns information about the albums the artist is featured on
export const getArtistAlbums = async (artistId) => {
  const access_token = await getAccessToken();

  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/albums`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.statusText}`);
  }

  const data = await response.json();
  const filteredAlbums = data.items.map(album => ({
    id: album.id,
    name: album.name,
    image: album.images[0]?.url,
    href: album.href
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
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.statusText}`);
  }

  const data = await response.json();
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

