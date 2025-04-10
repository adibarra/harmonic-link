import { setCookie, getCookie, deleteCookie } from "cookies-next/client"

export async function fetchAlbumAlbum(genre: string): Promise<StartEnd[] | null> {
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
    const artistAlbums: StartEnd[] = data.map((item: StartEnd) => ({
      id1: String(item.id1),
      id2: String(item.id2),
      par: String(item.par)
    })) || [];

    return artistAlbums;

  } catch (error) {
    console.error("Error fetching artist albums:", error);
    return null;
  }
}
