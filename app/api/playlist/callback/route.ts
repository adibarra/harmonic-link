
import { getAccessToken} from "@/lib/authentication";
import { NextResponse } from "next/server";

interface LinkItem {
  id: string;
  type: "artist" | "album";
}


const MARKET = "US";

export async function POST(req: Request) {
  try {
    
    const ACCESS_TOKEN = await getAccessToken(); // replace this
    console.log("Playlist route hit");
    console.log("hardcoded access token",ACCESS_TOKEN);

    // Fetch the user profile from the Spotify Web API
    const userProfileRes = await fetch("https://api.spotify.com/v1/me", {
        headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`, // or whatever variable you're using
        },
    });
    
    if (!userProfileRes.ok) {
        throw new Error("Failed to fetch user profile");
    }
    
    const userProfile = await userProfileRes.json();
    const userId = userProfile.id;
    
    const testRes = await fetch("https://api.spotify.com/v1/artists/4YRxDV8wJFPHPTeXepOstw/top-tracks?market=US", {
    headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    });
    console.log(" Test artist top tracks status:", testRes.status);
    console.log(" Test response JSON:", await testRes.json());

    const { linkChain } = await req.json();
    console.log(" linkChain received:", linkChain);

    const artistsOnly = linkChain.filter((item: any) => !item.artist);

    console.log("artist chain received:",artistsOnly);

    let trackUris: string[] = [];

    // Fetch top 5 tracks per artist
    for (const artist of artistsOnly) {
       
      const res = await fetch(
        `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=${MARKET}`,
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        }
      );

      if (!res.ok) {
        console.error(` Failed to fetch top tracks for artist ${artist.id}`);
        continue;
      }

      const topTracksJson = await res.json();
      const top5Tracks = topTracksJson.tracks.slice(0, 5);
      const uris = top5Tracks.map((track: any) => track.uri);
      trackUris.push(...uris);
    }

    console.log(" Total tracks collected:", trackUris.length);

    if (trackUris.length === 0) {
      return NextResponse.json({ error: "No tracks found." }, { status: 400 });
    }

    // Create a new playlist
    const createPlaylistResponse = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "HARMONIC LINKS PLAYLIST",
          description: "Created for you! Time to discover more music!!",
          public: true,
        }),
      }
    );

    if (!createPlaylistResponse.ok) {
      const errorText = await createPlaylistResponse.text();
      throw new Error(`Failed to create playlist: ${errorText}`);
    }

    const playlistData = await createPlaylistResponse.json();
    const playlistId = playlistData.id;

    // Add tracks to the playlist
    const addTracksResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: trackUris }),
      }
    );

    if (!addTracksResponse.ok) {
      const errorText = await addTracksResponse.text();
      throw new Error(`Failed to add tracks: ${errorText}`);
    }

    console.log("Playlist created and tracks added");

    return NextResponse.json({
      playlistUrl: playlistData.external_urls.spotify,
    });

  } catch (error) {
    console.error("Error creating playlist:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
