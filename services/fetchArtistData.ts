const artistCache: { [key: string]: Artist } = {};

export function cacheArtist(artist: Artist) {
  artistCache[artist.id] = artist;
}

export async function fetchArtistData(artistId: string): Promise<Artist | null> {
  if (artistCache[artistId]) {
    console.log("Fetching from cache");
    return artistCache[artistId];
  }

  try {




    // simulate api call
    const response = await fetch(`/api/game?type=artist&ID=${artistId}`);

    if(!response.ok) {
      throw new Error (`API request failed with status ${response.status}`);
    }

    const artistData = await response.json();
    if (artistData) {
      cacheArtist(artistData);
      console.log("Fetching from API");
      return artistData;
    } else {
      throw new Error("Artist not found");
    }
  } catch (error) {
    console.error("Error fetching artist data:", error);
    return null;
  }
}
