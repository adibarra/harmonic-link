import { setCookie, getCookie, deleteCookie } from "cookies-next/client"
import { fetchAlbum } from "./fetchAlbum";

export async function fetchAlbumAlbum(genre: string): Promise<Album[] | null> {
  try {
    // Generate and set cookie
    let token = Math.random().toString(36).substring(2, 15);
    setCookie(token, token, {
      maxAge: 30,
      path: '/',
      sameSite: 'strict'
    });

    const response = await fetch(`/api/game?type=albumAlbum&id=${genre}`, {
      headers: { 'X-Session-Token': token },
      credentials: 'include' // Required for cookies
    });

    console.log(deleteCookie(token));

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const albums = await Promise.all([
      fetchAlbum(data.id1),
      fetchAlbum(data.id2)
    ]);

    albums.some((album) => {
      if (album === null)
        throw new Error(`Failed to fetch album data`);
      return null;
    });

    return albums as Album[];

  } catch (error) {
    console.error("Error fetching albums:", error);
    return null;
  }
}
