/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { choices, getRPSWinner } from "@/lib/utils";
import { Choice, Game } from "../../../types";
import AuthContext from "../(context)/AuthContext";
import { ChannelContext } from "../(context)/ChannelContext";
import { updatePlayerScore } from "@/lib/serverfunctions";

export default function RockPaper({
	game,
	playersCompleted,
	setDisplayWinner,
	setWinner,
}: {
	game: Game;
	playersCompleted: boolean;
	setDisplayWinner: React.Dispatch<React.SetStateAction<boolean>>;
	setWinner: React.Dispatch<React.SetStateAction<string>>;
}) {
	const [firstPlayerAnswer, setFirstPlayerAnswer] = useState<string>("");
	const [firstSelected, setFirstSelected] = useState<boolean>(false);
	const [secondSelected, setSecondSelected] = useState<boolean>(true);
	const { user } = useContext(AuthContext);
	const { channel } = useContext(ChannelContext);

	const handleFirstPlay = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const initialPlay = formData.get("firstPlay") as string;
		channel?.sendEvent({
			// @ts-expect-error: channel.sendEvent may not be typed for custom events
			type: "game-play",
			data: {
				player: user,
				answer: initialPlay,
			},
		});
		setFirstSelected(true);
		e.currentTarget.reset();
	};

	const handleCalcWinner = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSecondSelected(true);
		const formData = new FormData(e.currentTarget);
		const secondPlay = formData.get("secondPlay") as string;
		const winner = getRPSWinner({
			player1Ans: firstPlayerAnswer as Choice,
			player1Name: game.players[0].nickname,
			player2Ans: secondPlay as Choice,
			player2Name: game.players[1].nickname,
		});
		setWinner(winner);

		const winnerId =
			winner === game.players[0].nickname
				? game.players[0].id
				: winner === game.players[1].nickname
				? game.players[1].id
				: null;

		if (winnerId) {
			await updatePlayerScore(winnerId, game.id);
		}
		channel?.sendEvent({
			// @ts-expect-error: channel.sendEvent may not be typed for custom events
			type: "winner-selected",
			data: {
				winner,
				draw: winner === "It's a draw!" ? true : false,
				id: winnerId,
			},
		});
		e.currentTarget.reset();
		setFirstPlayerAnswer("");
	};

	useEffect(() => {
		if (!channel) return;
		const handleGamePlay = (event: any) => {
			if (event.user?.id === user?.id) return;
			setSecondSelected(false);
			setFirstPlayerAnswer(event?.data?.answer as string);
		};

		const handleWinnerSelected = async (event: any) => {
			const winnerName = event?.data?.winner as string;
			const isDraw = event?.data?.draw;
			if (isDraw) {
				setWinner("It's a draw!");
			} else {
				setWinner(winnerName);
			}
			setDisplayWinner(true);
		};

		// Register listeners
		// @ts-expect-error: channel.on may not be typed for custom events
		channel.on("game-play", handleGamePlay);
		// @ts-expect-error: channel.on may not be typed for custom events
		channel.on("winner-selected", handleWinnerSelected);

		// Cleanup
		return () => {
			// @ts-expect-error: channel.off may not be typed for custom events
			channel.off("game-play", handleGamePlay);
			// @ts-expect-error: channel.off may not be typed for custom events
			channel.off("winner-selected", handleWinnerSelected);
		};
	}, [channel, game.id, user?.id, setDisplayWinner, setWinner]);

	return (
		<div className='w-full flex flex-col items-center justify-center h-[90vh] '>
			<div className='flex flex-col items-center justify-center h-screen'>
				<h1 className='text-2xl text-gray-500 font-bold mb-2'>
					Rock Paper Scissors
				</h1>

				<div className='md:w-2/3 mx-auto flex items-center justify-between space-x-8'>
					<section className='flex flex-col items-center'>
						<Avatar className='w-24 h-24 mb-2'>
							<AvatarImage
								src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${game.players[0].nickname}`}
							/>
							<AvatarFallback>{game.players[0].nickname}</AvatarFallback>
						</Avatar>
						<p className=' font-semibold text-blue-400'>
							@{game.players[0].nickname}
						</p>
						<h2 className=' text-5xl font-bold'>{game.players[0].score}</h2>

						{user?.id === game.players[0].id && (
							<form
								className='flex flex-col w-full items-center space-y-4 text-sm mt-4'
								onSubmit={handleFirstPlay}
							>
								<select
									className='border border-gray-300 rounded-md p-2'
									name='firstPlay'
									id='firstPlay'
									required
								>
									<option value=''>Select</option>
									{choices.map((choice) => (
										<option key={choice} value={choice}>
											{choice.charAt(0).toUpperCase() + choice.slice(1)}
										</option>
									))}
								</select>
								<button
									type='submit'
									disabled={firstSelected}
									className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200'
								>
									{firstSelected ? "Waiting..." : "Play"}
								</button>
							</form>
						)}
					</section>

					<section className='flex flex-col items-center'>
						<Avatar className='w-24 h-24 mb-2'>
							<AvatarImage
								src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${game.players[1].nickname}`}
							/>
							<AvatarFallback>{game.players[1].nickname}</AvatarFallback>
						</Avatar>
						<p className=' font-semibold text-blue-400'>
							@{game.players[1].nickname}
						</p>
						<h2 className=' text-5xl font-bold'>{game.players[1].score}</h2>

						{user?.id === game.players[1].id && !secondSelected && (
							<form
								className='flex flex-col w-full items-center space-y-4 text-sm mt-4'
								onSubmit={handleCalcWinner}
							>
								<select
									className='border border-gray-300 rounded-md p-2'
									name='secondPlay'
									id='secondPlay'
								>
									{choices.map((choice) => (
										<option key={choice} value={choice}>
											{choice.charAt(0).toUpperCase() + choice.slice(1)}
										</option>
									))}
								</select>
								<button
									type='submit'
									className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200'
								>
									Play
								</button>
							</form>
						)}
					</section>
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
		</div>
	);
}