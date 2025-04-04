const artistCache: { [artistID: string]: Artist } = {};

export async function fetchArtist(artistID: string): Promise<Artist | null> {
  if (artistCache[artistID]) {
    console.log("Fetching album artists from cache");
    return artistCache[artistID];
  }

  try {
    const response = await fetch(`/api/game?type=artist&ID=${artistID}`);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const artist = await response.json();
    artistCache[artistID] = artist;

    return artist;

  } catch (error) {
    console.error("Error fetching album artists:", error);
    return null;
  }
}
