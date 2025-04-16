type UploadResult = "success" | "fail";

export async function uploadFinishedGameToLeaderBoard(
  gameId: number,
  startArtistId: number,
  endArtistId: number,
  startTime: number,
  endTime: number,
  score: number,
  startAlbumId: number,
  endAlbumId: number,
  numLinksMade: number,
  gameMode: string,
): Promise<UploadResult | null> {
  try {
    const response = await fetch(
      `/api/leaderboard?game_id=${gameId}&start_artist_id=${startArtistId}&end_artist_id=${endArtistId}&start_time=${startTime}&end_time=${endTime}&score=${score}&start_album_id=${startAlbumId}&end_album_id=${endAlbumId}&num_links_made=${numLinksMade}&game_mode=${encodeURIComponent(gameMode)}`,
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("data: ", data);

    return "success";
  } catch (error) {
    console.error("Error uploading finished game to leaderboard: ", error);
    return "fail";
  }
}
