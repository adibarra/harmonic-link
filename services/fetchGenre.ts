const genreCache: { [genreName: string]: Genre } = {};

export async function fetchGenre(): Promise<string | null> {
  try {
    const response = await fetch(`/api/game?type=genre`);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const artist = await response.json;
    //genreCache = artist;

    return artist.name;

  } catch (error) {
    console.error("Error fetching album artists:", error);
    return null;
  }
}
