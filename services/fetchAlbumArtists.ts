const albumArtistsCache: { [albumId: string]: Artist[] } = {};

export async function fetchAlbumArtists(albumId: string): Promise<Artist[] | null> {
  if (albumArtistsCache[albumId]) {
    console.log("Fetching album artists from cache");
    return albumArtistsCache[albumId];
  }

  try {
    const response = await fetch(`/api/game?type=albumArtists&ID=${albumId}`);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const albumArtists = await response.json();
    albumArtistsCache[albumId] = albumArtists;

    return albumArtists;

  } catch (error) {
    console.error("Error fetching album artists:", error);
    return null;
  }
}
