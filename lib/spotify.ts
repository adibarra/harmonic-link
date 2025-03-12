const getAccessToken = async () => {
	const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN as string;
	if (!refresh_token) {
		throw new Error("Missing SPOTIFY_REFRESH_TOKEN");
	}

	const response = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: {
			Authorization: `Basic ${Buffer.from(
				`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
			).toString("base64")}`,
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token,
		}),
	});
	const { access_token } = await response.json();

	return access_token;
	//This returns the access token required in all spotify api endpoints
};

export const topArtists = async () => {
	const access_token = await getAccessToken();

	const response = await fetch(
		"https://api.spotify.com/v1/search?q=genre:pop&type=artist&limit=5",
		{
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		},
	);

	if (!response.ok) {
		throw new Error(`Spotify API error: ${response.statusText}`);
	}

	const data = await response.json();
	return data;
};
