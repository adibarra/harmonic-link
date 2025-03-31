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
    const mockedAlbumArtists: { [key: string]: Artist[] } = {
      "1": [
        {
          id: "000",
          name: "Imagine Dragons",
          image: "https://i.scdn.co/image/ab67616100005174ab47d8dae2b24f5afe7f9d38",
        },
        {
          id: "003",
          name: "Kendrick Lamar",
          image: "https://placehold.co/150/png",
        },
      ],
      "2": [
        {
          id: "001",
          name: "Taylor Swift",
          image: "https://i.scdn.co/image/ab67616100005174e672b5f553298dcdccb0e676",
        },
        {
          id: "003",
          name: "Kendrick Lamar",
          image: "https://placehold.co/150/png",
        },
      ],
      "3": [
        {
          id: "001",
          name: "Taylor Swift",
          image: "https://i.scdn.co/image/ab67616100005174e672b5f553298dcdccb0e676",
        },
        {
          id: "002",
          name: "Ed Sheeran",
          image: "https://placehold.co/150/png",
        },
      ],
      "4": [
        {
          id: "000",
          name: "Imagine Dragons",
          image: "https://i.scdn.co/image/ab67616100005174ab47d8dae2b24f5afe7f9d38",
        },
        {
          id: "002",
          name: "Ed Sheeran",
          image: "https://placehold.co/150/png",
        },
      ],
      "5": [
        {
          id: "002",
          name: "Ed Sheeran",
          image: "https://placehold.co/150/png",
        },
        {
          id: "003",
          name: "Kendrick Lamar",
          image: "https://placehold.co/150/png",
        },
      ],
      "6": [
        {
          id: "002",
          name: "Ed Sheeran",
          image: "https://placehold.co/150/png",
        },
        {
          id: "003",
          name: "Kendrick Lamar",
          image: "https://placehold.co/150/png",
        },
      ],
      "7": [
        {
          id: "003",
          name: "Kendrick Lamar",
          image: "https://placehold.co/150/png",
        },
        {
          id: "000",
          name: "Imagine Dragons",
          image: "https://i.scdn.co/image/ab67616100005174ab47d8dae2b24f5afe7f9d38",
        },
      ],
    };

    const albumArtists = mockedAlbumArtists[albumId];
    if (albumArtists) {
      cacheAlbumArtists(albumId, albumArtists);
      console.log("Fetching album artists from mock API");
      return albumArtists;
    } else {
      throw new Error("No artists found for the album");
    }
  } catch (error) {
    console.error("Error fetching album artists:", error);
    return null;
  }
}
