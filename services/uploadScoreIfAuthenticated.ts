// This function is temporary for now make sure to clean up the response types from the api
export async function uploadScoreIfAuthenticated(score: number): Promise<null> {
  try {
    const response = await fetch(`api/game?score=${score}`);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    // This is temporary clean this up
    const status = await response.json();
    return status;
  } catch (error) {
    console.error("Error uploading user score:", error);
    return null;
  }
}
