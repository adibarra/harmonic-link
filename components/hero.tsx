import Image from "next/image";

export default function Hero() {
	return (
		<div className="flex flex-col gap-16 items-center text-center p-6">
			<h1 className="text-5xl font-bold">Harmonic Links</h1>
			<p className="text-xl max-w-2xl">
				Discover the musical connections between your favorite artists. Start
				with one artist and find the path to another through their albums and
				collaborations.
			</p>
		</div>
	);
}
