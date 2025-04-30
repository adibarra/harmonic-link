
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const MARKET = 'US';

const getFormattedTimestamp = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1); // Month is 0-based, so add 1
  const day = String(now.getDate());
  const year = now.getFullYear();
  return `${month}/${day}/${year}`;
};

export async function POST(request: Request) {
  try {
    // Validate environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Playlist: Missing Supabase environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Helper to parse cookies
    const parseCookies = (cookieHeader: string | null): Record<string, string> => {
      const cookies: Record<string, string> = {};
      if (!cookieHeader) return cookies;
      cookieHeader.split(';').forEach((cookie) => {
        const [name, value] = cookie.trim().split('=');
        cookies[name] = value;
      });
      return cookies;
    };

    // Initialize cookie store
    const cookieStore = await cookies();

    // Initialize Supabase client
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        get(name: string) {
          const cookieHeader = request.headers.get('cookie');
          const parsedCookies = parseCookies(cookieHeader);
          
          // Only log and return for the specific cookie name requested
          const value = parsedCookies[name];
      //    console.log(`Playlist: Cookie ${name}:`, value ? value.substring(0, 10) + '...' : 'not found');
          return value;
        },
        set(name: string, value: string, options: any) {
      //    console.log(`Playlist: Setting cookie ${name}:`, value.substring(0, 10) + '...', options);
          cookieStore.set(name, value, { ...options, secure: false });
        },
        remove(name: string) {
      //    console.log(`Playlist: Removing cookie ${name}`);
          cookieStore.delete(name);
        },
      },
    });

    // Get authenticated user and session
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    //console.log('Playlist: User fetch result:', { userId: user?.id, error: userError?.message });

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    //console.log('Playlist: Session fetch result:', { hasSession: !!session, error: sessionError?.message });

    if (userError || !user) {
      console.error('Playlist: No authenticated user:', userError?.message);
      return NextResponse.json({ error: 'Unauthorized', linkChain: null, topTracks: null }, { status: 401 });
    }

    if (sessionError || !session) {
      console.error('Playlist: No session found:', sessionError?.message);
      return NextResponse.json({ error: 'No session available', linkChain: null, topTracks: null }, { status: 400 });
    }

    const providerToken = session.provider_token;
    if (!providerToken) {
      console.error('Playlist: No Spotify provider_token found in session');
      return NextResponse.json({ error: 'No Spotify token available', linkChain: null, topTracks: null }, { status: 401 });
    }
    //console.log('Playlist: Provider token found:', providerToken.substring(0, 10) + '...');

    // Parse request body
    const { linkChain, useArtists = true } = await request.json();
    //console.log('Playlist: Incoming request body:', JSON.stringify({ linkChain, useArtists }, null, 2));

    if (!linkChain || !Array.isArray(linkChain)) {
      console.error('Playlist: Invalid linkChain data:', linkChain);
      return NextResponse.json({ error: 'Invalid linkChain data', linkChain, topTracks: null }, { status: 400 });
    }

    // Get Spotify user ID
    const profileRes = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${providerToken}` },
    });
    if (!profileRes.ok) {
      const errorText = await profileRes.text();
      console.error('Playlist: Failed to fetch Spotify user profile:', profileRes.status, errorText);
      return NextResponse.json({ error: 'User must be logged in with Spotify', linkChain, topTracks: null }, { status: profileRes.status });
    }
    const userProfile = await profileRes.json();
    const userId = userProfile.id;
    //console.log('Playlist: Spotify User ID:', userId);

  
    const artistsOnly = linkChain.filter((item: any) => {
      // Infer type: 'artist' if href includes '/artist/' or item has popularity (artist-specific)
      const isArtist = item.type === 'artist' || item.href?.includes('/artist/') || item.popularity;
      const isValid = item.id && (!useArtists || isArtist);
      if (!isValid) {
       // console.log(`Playlist: Filtered out item:`, JSON.stringify(item, null, 2));
      }
      return isValid;
    });
   // console.log('Playlist: Filtered artistsOnly:', JSON.stringify(artistsOnly, null, 2));

    if (artistsOnly.length === 0) {
      console.error('Playlist: No valid artists found in linkChain');
      return NextResponse.json({ error: 'No valid artists found', linkChain, topTracks: null }, { status: 400 });
    }
    const trackUris: string[] = [];
    const topTracksByArtist: Record<string, any[]> = {};
    const maxTracksPerArtist = 5;

    for (const artist of artistsOnly) {
      try {
       // console.log(`Playlist: Fetching top tracks for artist ${artist.id}`);
        const res = await fetch(`https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=${MARKET}`, {
          headers: { Authorization: `Bearer ${providerToken}` },
        });
        if (!res.ok) {
          const errorText = await res.text();
          console.error(`Playlist: Failed to fetch top tracks for artist ${artist.id}: ${res.status} ${errorText}`);
          continue;
        }
        const topTracksJson = await res.json();
        //console.log(`Playlist: Top tracks response for artist ${artist.id}:`, JSON.stringify(topTracksJson, null, 2));

        const topTracks = topTracksJson.tracks?.slice(0, maxTracksPerArtist) || [];
        const uris = topTracks.map((track: any) => track.uri).filter((uri: string) => uri);
        
        trackUris.push(...uris);
        topTracksByArtist[artist.id] = topTracks;
        //console.log(`Playlist: Fetched ${uris.length} tracks for artist ${artist.id}`);
      } catch (error) {
        console.error(`Playlist: Error fetching tracks for artist ${artist.id}:`, error);
        continue;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (trackUris.length === 0) {
      console.error('Playlist: No tracks found for the provided artists');
      return NextResponse.json({ error: 'No tracks found for the provided artists', linkChain, topTracks: topTracksByArtist }, { status: 400 });
    }
    //console.log('Playlist: Total track URIs collected:', trackUris.length);
  let playlistName: string;
    if (artistsOnly.length >= 1) {
      const firstArtist = artistsOnly[0].name || 'Unknown';
      const lastArtist = artistsOnly[artistsOnly.length - 1].name || 'Unknown';
      playlistName = `HARMONIC LINKS - ${firstArtist} x ${lastArtist}`;
    } else {
      playlistName = `HARMONIC LINKS -${getFormattedTimestamp()}`; // Fallback for no artists
    }
    // Create playlist
    const playlistRes = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${providerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: playlistName,
        description: `A playlist generated by Harmonic Links on ${getFormattedTimestamp()}`,
        public: true,
      }),
    });
    if (!playlistRes.ok) {
      const errorText = await profileRes.text();
      console.error('Playlist: Failed to create playlist:', playlistRes.status, errorText);
      return NextResponse.json({ error: 'Failed to create playlist', linkChain, topTracks: topTracksByArtist }, { status: playlistRes.status });
    }
    const playlist = await playlistRes.json();
    //console.log('Playlist: Created playlist ID:', playlist.id);

    // Add tracks to playlist
    const addTracksRes = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${providerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: trackUris }),
    });
    if (!addTracksRes.ok) {
      const errorText = await addTracksRes.text();
      console.error('Playlist: Failed to add tracks to playlist:', addTracksRes.status, errorText);
      return NextResponse.json({ error: 'Failed to add tracks to playlist', linkChain, topTracks: topTracksByArtist }, { status: addTracksRes.status });
    }
   // console.log('Playlist: Tracks added to playlist successfully');

    // Log cookies after successful playlist creation
   // console.log('Playlist: Cookies after playlist creation:', cookieStore.getAll());

    return NextResponse.json({ playlistUrl: playlist.external_urls.spotify, linkChain, topTracks: topTracksByArtist });
  } catch (error) {
    console.error('Playlist: Error in playlist creation:', error);
    return NextResponse.json({ error: 'Internal server error', linkChain: null, topTracks: null }, { status: 500 });
  }
}

