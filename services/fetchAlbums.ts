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


    const data = await response.json();

     const artistAlbums: Album[] = data.map((item: Album) => ({
      id: String(item.id),
      name: String(item.name),
      image: String(item.image),
      type: "album"

    })) || [];


    if (artistAlbums.length) {
      cacheAlbums(artistId, artistAlbums);
      return artistAlbums;
    }

    throw new Error("No valid albums found");
  } catch (error) {
    console.error("Error fetching artist albums:", error);
    return null;
  }
}
