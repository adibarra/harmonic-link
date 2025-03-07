import Hero from "@/components/hero";
import Link from "next/link";

export default async function Home() {
  return (
    <>
      <Hero />
      <main className="flex-1 flex flex-col gap-6 px-4">
        <h2 className="font-medium text-xl mb-4">Temporary links</h2>
        <Link className="underline" href="/game">Game</Link>
        <Link className="underline" href="/game/over">Game Over</Link>
        <Link className="underline" href="/game/loading">Game Loading</Link>
        <Link className="underline" href="/start">Start</Link>
      </main>
    </>
  );
}
