"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { motion } from "motion/react";

export default function LoginPage() {
  const supabase = createClient();

  const handleSpotify = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'spotify',
      options: {
        scopes: 'user-read-email user-read-private playlist-modify-public playlist-modify-private',
        redirectTo: `${location.origin}/api/auth/callback?next=/`,
      },
    });

    if (error) {
      console.error('Spotify OAuth error:', error);
    } else {
      console.log('Redirecting to Spotify...');
    }
  };

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'email profile openid', // these are standard Google scopes; Spotify scopes won't apply here
        redirectTo: `${location.origin}/api/auth/callback?next=/`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Google OAuth error:', error);
    } else {
      console.log('Redirecting to Google...');
    }
  };

  const fadeInOut = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <motion.div
      className="flex flex-col items-center px-4 py-10 md:px-6"
      {...fadeInOut}
    >
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Harmonic Links</h1>
        </div>

        <Card className="shadow-xl border-none">
          <CardHeader className="text-center">
            <CardDescription>
              Log in to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <Button
              variant="default"
              className="w-full max-w-xs gap-3 text-base font-medium"
              onClick={handleSpotify}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 496 512"
                className="h-5 w-5"
              >
                <path
                  fill="#1ED760"
                  d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 7.4 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z"
                />
              </svg>
              Login with Spotify
            </Button>
            <Button
              variant="default"
              className="w-full max-w-xs gap-3 text-base font-medium"
              onClick={handleGoogle}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 533.5 544.3"
                className="h-5 w-5"
              >
                <path fill="#4285f4" d="M533.5 278.4c0-17.6-1.5-34.5-4.4-50.9H272v96.4h146.7c-6.3 33.8-25.1 62.3-53.6 81.4v67h86.7c50.7-46.7 81.7-115.7 81.7-193.9z"/>
                <path fill="#34a853" d="M272 544.3c72.6 0 133.5-24.1 178-65.2l-86.7-67c-24.1 16.2-55 25.8-91.3 25.8-70 0-129.3-47.2-150.5-110.4H32.1v69.6c44.3 88.2 135.6 147.2 239.9 147.2z"/>
                <path fill="#fbbc04" d="M121.5 327.5c-10.6-31.8-10.6-66.1 0-97.9V160H32.1c-35.1 69.6-35.1 152.7 0 222.3l89.4-54.8z"/>
                <path fill="#ea4335" d="M272 107.7c39.4-.6 77 13.4 106 39.1l79.3-79.3C426.8 25 351.6-2.5 272 0 167.7 0 76.4 59 32.1 147.2l89.4 69.6c21.2-63.2 80.5-110.4 150.5-109.1z"/>
              </svg>
              Login with Google
            </Button>
          </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
