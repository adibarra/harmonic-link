import { fetchArtist } from "./fetchArtist";

const albumsCache: { [artistID: string]: Album[] } = {};

export async function fetchAlbums(artistID: string): Promise<Album[] | null> {
  if (albumsCache[artistID]) {
    console.log("Fetching albums from cache");
    return albumsCache[artistID];
  }

  try {
    const [artist, albumResponse] = await Promise.all([
      fetchArtist(artistID),
      fetch(`/api/game?type=artistAlbums&ID=${artistID}`)
    ]);

    if (!artist || !albumResponse.ok) {
      throw new Error(
        `API request failed with status ${albumResponse.status}`
      );
    }

    const albumData = await albumResponse.json();

    const albums = albumData.map((item: Album) => ({
      id: String(item.id),
      name: String(item.name),
      artist: String(artist.name),
      image: String(item.image)
    })) || [];

    albumsCache[artistID] = albums;

    return albums;

  } catch (error) {
    console.error("Error fetching artist albums:", error);
    return null;
  }
}
