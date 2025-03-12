const artistCache: { [key: string]: Artist } = {};

export function cacheArtist(artist: Artist) {
	artistCache[artist.id] = artist;
}

export async function fetchArtistData(
	artistId: string,
): Promise<Artist | null> {
	if (artistCache[artistId]) {
		console.log("Fetching from cache");
		return artistCache[artistId];
	}

	try {
		// mock api
		const mockedArtists: { [key: string]: Artist } = {
			"000": {
				id: "000",
				name: "Imagine Dragons",
				image:
					"https://i.scdn.co/image/ab67616100005174ab47d8dae2b24f5afe7f9d38",
			},
			"001": {
				id: "001",
				name: "Taylor Swift",
				image:
					"https://i.scdn.co/image/ab67616100005174e672b5f553298dcdccb0e676",
			},
			"002": {
				id: "002",
				name: "Kendrick Lamar",
				image: "https://placehold.co/150/png",
			},
			"003": {
				id: "003",
				name: "Ed Sheeran",
				image: "https://placehold.co/150/png",
			},
		};

		// simulate api call
		const artistData = mockedArtists[artistId];
		if (artistData) {
			cacheArtist(artistData);
			console.log("Fetching from mock API");
			return artistData;
		} else {
			throw new Error("Artist not found");
		}
	} catch (error) {
		console.error("Error fetching artist data:", error);
		return null;
	}
}
