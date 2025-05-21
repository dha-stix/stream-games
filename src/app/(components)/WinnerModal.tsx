"use client";
import { useRouter } from "next/navigation";

export default function WinnerModal({
	winner,
	setWinner,
	setDisplayWinner,
}: {
	winner: string;
	setWinner: React.Dispatch<React.SetStateAction<string>>;
	setDisplayWinner: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const router = useRouter();

	const handleEndGame = () => router.push("/games");
	const handleAnotherRound = () => {
		setWinner("");
		setDisplayWinner(false);
	};

	return (
		<main className='flex flex-col items-center justify-center h-screen'>
			<h1 className='text-xl text-center'>Winner 🎉</h1>
			<h2 className='text-center text-gray-400'>
				The winner of this round is:
			</h2>
			<p className='text-2xl text-blue-500 font-bold mb-8'>{winner}</p>

			<div className='flex items-center justify-center mb-4'>
				<button
					className='bg-red-400 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200 text-sm'
					onClick={handleEndGame}
				>
					End Game Session
				</button>

				<button
					className='bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 text-sm ml-4'
					onClick={handleAnotherRound}
				>
					Another Round
				</button>
			</div>
		</main>
	);
}