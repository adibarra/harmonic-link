const albumArtistsCache: { [albumID: string]: Artist[] } = {};

export async function fetchAlbumArtists(albumID: string): Promise<Artist[] | null> {
  if (albumArtistsCache[albumID]) {
    console.log("Fetching album artists from cache");
    return albumArtistsCache[albumID];
  }

  try {
    const response = await fetch(`/api/game?type=albumArtists&ID=${albumID}`);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const albumArtists = await response.json();
    albumArtistsCache[albumID] = albumArtists;

    return albumArtists;

  } catch (error) {
    console.error("Error fetching album artists:", error);
    return null;
  }
}
