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


    const response = await fetch(`/api/game?type=artistAlbums&ID=${artistId}`);

    if(!response.ok) {
      throw new Error (`API request failed with status ${response.status}`);
    }

    const artistAlbums = await response.json();
    if (artistAlbums) {
      cacheAlbums(artistId, artistAlbums);
      console.log("Fetching from API");
      return artistAlbums;
    } else {
      throw new Error("Artist not found");
    }
  } catch (error) {
    console.error("Error fetching artist data:", error);
    return null;
  }
}
