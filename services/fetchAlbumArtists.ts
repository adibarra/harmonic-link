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

     const data = await response.json();

          const albumArtists: Artist[] = data.map((item: Artist) => ({
           id: String(item.id),
           name: String(item.name),
           image: String(item.image)

         })) || [];


         if (albumArtists.length) {
           cacheAlbumArtists(albumId, albumArtists);
           return albumArtists;
         }

         throw new Error("No valid albums found");
       } catch (error) {
         console.error("Error fetching artist albums:", error);
         return null;
       }
     }
