import { setCookie, getCookie, deleteCookie } from "cookies-next/client"
import { fetchArtist } from "./fetchArtist";

export async function fetchArtistArtist(genre: string): Promise<Artist[] | null> {
  try {
    // Generate and set cookie
    let token = Math.random().toString(36).substring(2, 15);
    setCookie(token, token, {
      maxAge: 30,
      path: '/',
      sameSite: 'strict'
    });

    const response = await fetch(`/api/game?type=artistArtist&id=${genre}`, {
      headers: { 'X-Session-Token': token },
      credentials: 'include' // Required for cookies
    });

    console.log(deleteCookie(token));

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const artists = await Promise.all([
      fetchArtist(data.id1),
      fetchArtist(data.id2)
    ]);

    artists.some((artist) => {
      if (artist === null)
        throw new Error(`Failed to fetch artist data.`);
      return null;
    });

    return artists as Artist[];

  } catch (error) {
    console.error("Error fetching artist albums:", error);
    return null;
  }
}
