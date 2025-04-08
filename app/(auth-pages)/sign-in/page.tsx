"use client"

import { createClient } from "@/utils/supabase/client";
import { create } from "lodash";

const handleLogin = async () => {
const supabase = await createClient()
const { data, error } = await supabase.auth.signInWithOAuth({
provider: 'spotify',
  options: {
  redirectTo: 'http://localhost:3000/api/auth/callback?next=/', // or your deployed URL
  scopes: 'user-read-email user-read-private',
  },
});

if (error) {
  console.error('OAuth error:', error);
} else {
  console.log('Redirecting to Spotify...');
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
  </main>
);
}
