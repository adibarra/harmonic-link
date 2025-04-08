"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { motion } from "motion/react";

const handleLogin = async () => {
  const origin = window.location.origin;
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "spotify",
    options: {
      redirectTo: `${origin}/api/auth/callback?next=/`,
      scopes: "user-read-email user-read-private",
    },
  });

  if (error) {
    console.error("OAuth error:", error);
  } else {
    console.log("Redirecting to Spotify...");
  }
};

export default function LoginPage() {
  const fadeInOut = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <motion.div
      className="flex min-h-svh flex-col items-center px-4 py-10 md:px-6"
      {...fadeInOut}
    >
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Harmonic Links</h1>
        </div>

        <Card className="shadow-xl border-none">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">Welcome</CardTitle>
            <CardDescription>
              Log in using your Spotify account to get started.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex justify-center">
              <Button
                variant="default"
                className="w-full max-w-xs gap-3 text-base font-medium"
                onClick={handleLogin}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 496 512"
                  className="h-5 w-5"
                >
                  <path
                    d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 7.4 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z"
                    fill="#1ED760"
                  />
                </svg>
                Login with Spotify
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
