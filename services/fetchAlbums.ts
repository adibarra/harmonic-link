const albumsCache: { [artistId: string]: Artist[] } = {};

export async function fetchAlbums(artistId: string): Promise<Artist[] | null> {
  if (albumsCache[artistId]) {
    console.log("Fetching albums from cache");
    return albumsCache[artistId];
  }

  try {
    const [artistResponse, albumResponse] = await Promise.all([
      fetch(`/api/game?type=artist&ID=${artistId}`),
      fetch(`/api/game?type=artistAlbums&ID=${artistId}`)
    ]);

    if (!artistResponse.ok || !albumResponse.ok) {
      throw new Error(
        `API request failed with status ${artistResponse.status} or ${albumResponse.status}`
      );
    }

    const artistData = await artistResponse.json();
    const albumData = await albumResponse.json();

    const albums = albumData.map((item: Album) => ({
      id: String(item.id),
      name: String(item.name),
      artist: String(artistData.name),
      image: String(item.image)
    })) || [];

    albumsCache[artistId] = albums;

    return albums;

  } catch (error) {
    console.error("Error fetching artist albums:", error);
    return null;
  }
}
