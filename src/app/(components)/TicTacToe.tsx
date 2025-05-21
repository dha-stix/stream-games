"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { Game } from "../../../types";
import Board from "./Board";

export default function TicTacToe({
	game,
	playersCompleted,
	setDisplayWinner,
	setWinner
}: {
	game: Game;
		playersCompleted: boolean;
		setDisplayWinner: React.Dispatch<React.SetStateAction<boolean>>;
		setWinner: React.Dispatch<React.SetStateAction<string>>;
	}) {

	return (
		<div className='w-full flex flex-col items-center justify-center min-h-[90vh] '>
			<h1 className='text-2xl text-gray-500 font-bold mb-2'>Tic Tac Toe</h1>

			<div className='w-full flex items-center justify-center space-x-4'>
				<Player
					playerName={game?.players[0].nickname}
					playerScore={game?.players[0].score}
				/>

				<Board game={game} setWinner={setWinner} setDisplayWinner={setDisplayWinner} />

				<Player
					playerName={game?.players[1].nickname}
					playerScore={game?.players[1].score}
				/>
			</div>

			{!playersCompleted && (
				<div className='flex flex-col items-center justify-center mt-12'>
					<button className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200'>
						Waiting for the other player...
						<Loader2 className='animate-spin ml-2 inline-block' />
					</button>
				</div>
			)}
		</div>
	);
}

export const Player = ({
	playerName,
	playerScore,
}: {
	playerName: string;
	playerScore: number;
}) => {
	return (
		<section className='w-1/4 flex flex-col items-center'>
			<Avatar className='w-24 h-24 mb-2'>
				<AvatarImage
					src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${playerName}`}
				/>
				<AvatarFallback>{playerName}</AvatarFallback>
			</Avatar>
			<p className=' font-semibold text-blue-400'>@{playerName}</p>
			<h2 className=' text-5xl font-bold'>{playerScore}</h2>

			<p className='text-red-500'>Your turn</p>
		</section>
	);
};