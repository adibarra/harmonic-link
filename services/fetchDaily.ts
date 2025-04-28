import { setCookie, getCookie, deleteCookie } from "cookies-next/client"

const dailyCache: { [date: string]: Challenge } = {};

export async function fetchDaily(): Promise<Challenge | null> {
  const date = new Date();
  const format = date.toLocaleString("en-US", {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const [mm, dd, yy] = format.split("/");
  const formattedDate = `${yy}-${mm}-${dd}`;

  if (dailyCache[formattedDate]) {
    console.log("Fetching daily data from cache");
    return dailyCache[formattedDate];
  }

  try {
    const response = await fetch(`/api/game?type=daily&id=${formattedDate}`);

    //deleteCookie(token);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    dailyCache[formattedDate] = data;

    return data;

  } catch (error) {
    console.error("Error fetching daily challenge:", error);
    return null;
  }
}
