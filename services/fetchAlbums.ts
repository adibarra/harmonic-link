import { setCookie, getCookie, deleteCookie } from "cookies-next/client"

const albumsCache: { [artistId: string]: Album[] } = {};

export function cacheAlbums(artistId: string, albums: Album[]) {
  albumsCache[artistId] = albums;
}



export async function fetchAlbums(artistId: string): Promise<Album[] | null> {
  if (albumsCache[artistId]) {
    console.log("Fetching albums from cache");
    return albumsCache[artistId];
  }

  try {
    // Generate and set cookie
    let token = Math.random().toString(36).substring(2, 15);
    setCookie(token, token, {
      maxAge: 30,
      path: '/',
      sameSite: 'strict'
    });

    const responseArtist = await fetch(`/api/game?type=artist&ID=${artistId}`, {
      headers: {
        'X-Session-Token': token

      },
      credentials: 'include' // Required for cookies
    });

    const nameData = await responseArtist.json();
    const artistName = nameData.name;

    console.log(deleteCookie(token));
    // Second request with same token
    token = Math.random().toString(36).substring(2, 15);
    setCookie(token, token, {
      maxAge: 30,
      path: '/',
      sameSite: 'strict'
    });

    const response = await fetch(`/api/game?type=artistAlbums&ID=${artistId}`, {
      headers: {
        'X-Session-Token': token

      },
      credentials: 'include'
    });

    console.log(deleteCookie(token));

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const artistAlbums: Album[] = data.map((item: Album) => ({
      id: String(item.id),
      name: String(item.name),
      artist: String(artistName),
      image: String(item.image)
    })) || [];

    if (artistAlbums.length) {
      cacheAlbums(artistId, artistAlbums);
      return artistAlbums;
    }

    throw new Error("No valid albums found");
  } catch (error) {
    console.error("Error fetching artist albums:", error);
    return null;
  }
}
