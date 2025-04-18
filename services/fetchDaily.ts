import { setCookie, getCookie, deleteCookie } from "cookies-next/client"

const dailyCache: { [date: string]: Artist[] } = {};

export async function fetchDaily(): Promise<Artist[] | null> {
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

    //deleteCookie(token)
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const artists = await response.json();
    dailyCache[formattedDate] = artists;

    return artists;

  } catch (error) {
    console.error("Error fetching daily artists:", error);
    return null;
  }
}
