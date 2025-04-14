"use client"

import { createClient } from "@/utils/supabase/client";
import { create } from "lodash";

const handleLogin = async () => {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'spotify',
    options: {
      scopes: 'user-read-email user-read-private playlist-modify-public playlist-modify-private',
      redirectTo: `${location.origin}/api/auth/callback?next=/`, // or your deployed URL

    },
  });

  if (error) {
    console.error('OAuth error:', error);
  } else {
    console.log('Redirecting to Spotify...');
  }
};
const handleGoogle = async () => {
  const supabase = createClient(); // no need to await this unless it's async in your setup

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://localhost:3000/api/auth/callback?next=/', // adjust for your framework/router if needed
      scopes: 'email profile openid', // these are standard Google scopes; Spotify scopes won't apply here
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error('Error during Google sign-in:', error.message);
  }
};

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Sign In</h1>

      <button
        onClick={handleLogin}
        className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700"
      >
        Sign in with Spotify
      </button>
      <button
        onClick={handleGoogle}
        className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700">
        Sign in With Google
      </button>
    </main>
  );
}
