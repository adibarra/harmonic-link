import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors";
import querystring from "querystring";
import bodyParser from "body-parser";
//import { TURBO_TRACE_DEFAULT_MEMORY_LIMIT } from "next/dist/shared/lib/constants";

dotenv.config();
//console.log("cli id:",process.env.SPOTIFY_USER_CLIENT_ID);

const app = express();
const PORT = 3000;

app.use(cors()); // Allow cross-origin requests
app.use(express.json());
app.use(bodyParser.json());

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL; // Must match what’s in your Spotify Developer Dashboard
const SPOTIFY_USER_ID = "sunaina.ayyagari";
const refreshToken= process.env.SPOTIFY_REFRESH_TOKEN;

// Spotify API endpoint for creating playlists
const SPOTIFY_CREATE_PLAYLIST_URL = `https://api.spotify.com/v1/users/${SPOTIFY_USER_ID}/playlists`;

let storedRefreshToken = ""; 

console.log("cli id",CLIENT_ID)
// STEP 1: Redirect user to Spotify login

app.get("/login", (req, res) => {
    const scope = "playlist-modify-public playlist-modify-private";
    //const scope = "user-read-private user-read-email";
    const state = Math.random().toString(36).substring(7); // Random string for security
    const authUrl = `https://accounts.spotify.com/authorize?` + 
        querystring.stringify({
            client_id: CLIENT_ID,
            response_type: "code",
            redirect_uri: REDIRECT_URL,
            scope: scope,
            state: state,
            show_dialog: true
        });

    res.redirect(authUrl);
});

const getAccessToken = async (refreshToken) => {
    const storedRefreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
    if (!storedRefreshToken) {
        throw new Error("Missing refresh token");
    }

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
        },
            body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: storedRefreshToken,
            }),
    });

    if (!response.ok) {
        throw new Error("Failed to refresh access token");
    }

    const { access_token } = await response.json();
    return access_token;
};
const fetchNewAccessToken = async (refreshToken) => {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        }),
    });
    const data = await response.json();
    return data.access_token;  // Return the new access token
};

app.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send("Authorization code missing");
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URL,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to exchange authorization code");
    }

    const { access_token, refresh_token } = await response.json();
    if (refresh_token) {
      storedRefreshToken = process.env.SPOTIFY_REFRESH_TOKEN; 
    }

    res.json({ access_token, refresh_token });
  } catch (error) {
    console.error("Error getting token", error.message);
    res.status(500).send("Failed to get access token");
  }
});

// Example: Protected route using the refreshed token
app.get("/me", async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const userProfile = await response.json();
    res.json(userProfile);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/playlists", async (req, res) => {
    const token = req.query.access_token;
    if (!token) return res.status(401).json({ error: "Missing access token" });

    try {
        console.log('Access token received:', token);
        const response = await fetch("https://api.spotify.com/v1/me/playlists", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        // Log raw response body as text before parsing
        const rawResponse = await response.text(); // .text() to get raw response
        console.log('Spotify raw response body:', rawResponse);

        if (!response.ok) {
            throw new Error(`Failed to get user playlists: ${rawResponse}`);
        }

        const userPlaylists = JSON.parse(rawResponse); // Manually parse if raw is valid JSON
        res.json(userPlaylists);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("Failed to get user playlists");
    }
});

const getUserId = async (accessToken) => {
    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    const data = await response.json();
    console.log("Raw response from apotify:", data);

    if (response.ok) {
        console.log("User id fetched", data.id)
        return data.id;  // Return user ID
    } else {
        throw new Error(`Failed to fetch user ID: ${data.error.message}`);
    }
};


app.get("/create-playlist" , async (req, res) => {
    try{
        console.log("🔄 Fetching new access token...");
        const accessToken= await fetchNewAccessToken(refreshToken);
        console.log("✅ Access token retrieved:", accessToken);

        console.log("🔄 Fetching Spotify User ID...");
        const user_id = await getUserId(accessToken);
        console.log("✅ User ID:", user_id);

        console.log("access token:",accessToken);
        console.log("user id", user_id)

        console.log("📝 Creating playlist...");
        const playlistResponse = await fetch( `https://api.spotify.com/v1/users/${user_id}/playlists`,{
            method: "POST",
            headers:{
                Authorization:`Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: "HARMONIC LINKS",
                description: "Created via API",
                public: true,
            }),
        });
        const textResponse = await playlistResponse.text();
        console.log("Raw response:", textResponse);

        if(!playlistResponse.ok){
            console.error("Error creating playlist:", textResponse);
            return res.status(playlistResponse.status).json({error:textResponse});
        }
        const playlistData = textResponse ? JSON.parse(textResponse) : {};
        console.log("Playlist created successfully:", playlistData);
        res.json(playlistData);
        console.log("Creation Response:", playlistData);
    }catch(error){
        console.error("Error creating playlist: ", error.message);
        res.status(500).json({error: error.message});
    }

});

// Define the POST route for /create_playlist
//app.post('/create_playlist', create_playlist_on_spotify);

// Start the Express server
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
