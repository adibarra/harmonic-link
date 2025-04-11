import { setCookie, getCookie, deleteCookie } from "cookies-next/client"

const artistEndlessCache: { [genre: string]: StartEnd } = {};

export function cacheAlbumEndless(genre: string, albums: StartEnd) {
  artistEndlessCache[genre] = albums;
}



export async function fetchArtistArtist(genre: string): Promise<StartEnd | null> {
  if (artistEndlessCache[genre]) {
    console.log("Fetching albums from cache");
    return artistEndlessCache[genre];
  }

  try {
    // Generate and set cookie
    let token = Math.random().toString(36).substring(2, 15);
    setCookie(token, token, {
      maxAge: 30,
      path: '/',
      sameSite: 'strict'
    });

    const response = await fetch(`/api/game?type=artistartist&ID=${genre}`, {
      headers: {
        'X-Session-Token': token

      },
      credentials: 'include' // Required for cookies
    });

    console.log(deleteCookie(token));;

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    /*const artistAlbums: StartEnd[] = data.map((item: StartEnd) => ({
      id1: String(item.id1),
      id2: String(item.id2),
      par: String(item.par)
    })) || [];*/


    cacheAlbumEndless(genre, data);
    return data;

    throw new Error("No valid albums found");
  } catch (error) {
    console.error("Error fetching artist albums:", error);
    return null;
  }
}

var m = fetchArtistArtist("alternative");
console.log(m);
