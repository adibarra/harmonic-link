const albumCache: { [albumID: string]: Album } = {};

export async function fetchAlbum(albumID: string): Promise<Album | null> {
  if (albumCache[albumID]) {
    console.log("Fetching album from cache");
    return albumCache[albumID];
  }

  try {
    const response = await fetch(`/api/game?type=album&id=${albumID}`);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const album = await response.json();
    albumCache[albumID] = album;

    return album;

  } catch (error) {
    console.error("Error fetching album:", error);
    return null;
  }
}
