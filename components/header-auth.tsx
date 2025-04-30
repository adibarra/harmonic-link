import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const name = user?.identities?.[0]?.identity_data?.name?.split(" ")[0] || user?.email?.split("@")[0] || "User";

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {name}!
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
    </div>
  );
}
