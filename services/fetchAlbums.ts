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
    // mock api
    const mockedAlbums: { [key: string]: Album[] } = {
      "000": [
        {
          id: "1",
          name: "LOOM",
          artist: "Imagine Dragons",
          image: "https://placehold.co/150/png",
        },
        {
          id: "2",
          name: "Origins",
          artist: "Imagine Dragons",
          image: "https://placehold.co/150/png",
        },
      ],
      "001": [
        {
          id: "3",
          name: "1989",
          artist: "Taylor Swift",
          image: "https://placehold.co/150/png",
        },
        {
          id: "4",
          name: "Fearless",
          artist: "Taylor Swift",
          image: "https://placehold.co/150/png",
        },
      ],
      "002": [
        {
          id: "5",
          name: "Divide",
          artist: "Ed Sheeran",
          image: "https://placehold.co/150/png",
        },
        {
          id: "6",
          name: "Plus",
          artist: "Ed Sheeran",
          image: "https://placehold.co/150/png",
        },
      ],
      "003": [
        {
          id: "7",
          name: "DAMN.",
          artist: "Kendrick Lamar",
          image: "https://placehold.co/150/png",
        },
        {
          id: "8",
          name: "To Pimp a Butterfly",
          artist: "Kendrick Lamar",
          image: "https://placehold.co/150/png",
        },
      ],
    };

    // simulate api call
    const artistAlbums = mockedAlbums[artistId];
    if (artistAlbums) {
      cacheAlbums(artistId, artistAlbums);
      console.log("Fetching albums from mock API");
      return artistAlbums;
    } else {
      throw new Error("Albums not found for the artist");
    }
  } catch (error) {
    console.error("Error fetching albums:", error);
    return null;
  }
}
