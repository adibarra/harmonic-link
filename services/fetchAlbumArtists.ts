const albumArtistsCache: { [albumId: string]: Artist[] } = {};

export function cacheAlbumArtists(albumId: string, artists: Artist[]) {
  albumArtistsCache[albumId] = artists;
}

export async function fetchAlbumArtists(albumId: string): Promise<Artist[] | null> {
  if (albumArtistsCache[albumId]) {
    console.log("Fetching album artists from cache");
    return albumArtistsCache[albumId];
  }

   try {




      // simulate api call
      const response = await fetch(`/api/game?type=albumArtists&ID=${albumId}`);

      if(!response.ok) {
        throw new Error (`API request failed with status ${response.status}`);
      }

      const albumArtists = await response.json();
      if (albumArtists) {
        cacheAlbumArtists(albumId, albumArtists);
        console.log("Fetching from API");
        return albumArtists;
      } else {
        throw new Error("Artist not found");
      }
    } catch (error) {
      console.error("Error fetching artist data:", error);
      return null;
    }
  }

