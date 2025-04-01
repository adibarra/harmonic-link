const date = new Date();
const format = date.toLocaleString("en-US", {
  timeZone: 'America/Chicago',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',

});

const [mm, dd, yy] = format.split("/");
const formattedDate = `${yy}-${mm}-${dd}`;


export async function fetchDaily(): Promise<Artist[] | null> {
  try {

    const response = await fetch(`/api/game?type=daily&ID=${formattedDate}`);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    const Artists: Artist[] = data.map((item: Artist) => ({
      id: String(item.id),
      name: String(item.name),
      image: String(item.image)

    })) || [];

    if (Artists.length) {
      return Artists;
    }

    throw new Error("No valid albums found");
  } catch (error) {
    console.error("Error fetching artist albums:", error);
    return null;
  }
}
