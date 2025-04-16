// TODO fix return type
export async function fetchLeaderboard(gameId: string): Promise<any | null> {
  try {
    const response = await fetch(`api/leaderboard?game_id=${gameId}`);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const games = await response.json();

    return games;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return null;
  }
}
