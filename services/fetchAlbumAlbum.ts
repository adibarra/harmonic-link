import { setCookie, getCookie, deleteCookie } from "cookies-next/client"

export async function fetchAlbumAlbum(): Promise<Challenge | null> {
  try {
    // Generate and set cookie
    let token = Math.random().toString(36).substring(2, 15);
    setCookie(token, token, {
      maxAge: 30,
      path: '/',
      sameSite: 'strict'
    });

    const response = await fetch(`/api/game?type=albumAlbum`, {
      headers: { 'X-Session-Token': token },
      credentials: 'include' // Required for cookies
    });

    console.log(deleteCookie(token));

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error fetching album album:", error);
    return null;
  }
}
