"use client";
import CopyToClipboard from "react-copy-to-clipboard";
import { generateGameUrl, games } from "@/lib/utils";
import { Leaderboard } from "../../../types";
import { ChannelContext } from "@/app/(context)/ChannelContext";
import { Copy } from "lucide-react";
import { useContext, useState } from "react";
import { Channel as ChannelType } from "stream-chat";
import { createGame } from "@/lib/serverfunctions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateGame({
	users,
	user,
	client,
}: {
	users: Leaderboard[];
	user: Leaderboard;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	client: any;
}) {
	const [copied, setCopied] = useState<boolean>(false);
	const [selectedGame, setSelectedGame] = useState<string>("");
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [gameId, setGameId] = useState<string>(generateGameUrl());
	const [buttonClicked, setButtonClicked] = useState<boolean>(false);
	const [selectedPlayer, setSelectedPlayer] = useState<string>("");
	const { setChannel } = useContext(ChannelContext);
	const [error, setError] = useState<boolean>(true);
	const router = useRouter();
	const handleCopy = () => setCopied(true);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setButtonClicked(true);

		const selectedPlayerObject = users.find(
			(user) => user.email === selectedPlayer
		);

		if (!selectedPlayerObject) {
			setButtonClicked(false);
			return;
		}

		const { message, status } = await createGame({
			id: gameId,
			type: selectedGame,
			players: [
				{ score: 0, id: user.id, email: user.email, nickname: user.nickname },
				{
					score: 0,
					id: selectedPlayerObject.id,
					email: selectedPlayerObject.email,
					nickname: selectedPlayerObject.nickname,
				},
			],
		});
		if (status !== 200) {
			toast.error(message);
			setButtonClicked(false);
			return;
		}
		toast.success("Game created successfully");

		const newChannel: ChannelType = await client.channel("messaging", gameId, {
			members: [user.id, selectedPlayerObject.id],
		});
		await newChannel.watch();
		setChannel(newChannel);
		router.push(`/games/${newChannel.id}`);
		setButtonClicked(false);
	};

	return (
		<>
			<main className=' md:px-8 px-4 py-4 flex md:w-2/3 mx-auto flex-col items-center justify-center h-[90vh]'>
				<h3 className='text-xl font-bold text-blue-500'>Create Game</h3>
				<p className='text-sm text-gray-600 mb-4'>
					Create a game request and play with your friends.
				</p>

				<form className='flex flex-col mt-4 w-full' onSubmit={handleSubmit}>
					<label htmlFor='player' className='text-sm text-gray-500'>
						Opponent Email
					</label>
					<input
						type='email'
						className='w-full p-2 border border-gray-300 rounded-md'
						placeholder='Enter player email'
						value={selectedPlayer}
						onChange={(e) => {
							setSelectedPlayer(e.target.value);
							const error = users.find(
								(u) => u.email === e.target.value && u.id !== user?.id
							);
							setError(!error);
						}}
						required
						name='player'
						id='player'
					/>
					{!error ? (
						<p className='text-xs text-green-500 mb-4'>
							Player found:{" "}
							{users.find((user) => user.email === selectedPlayer)?.nickname}
						</p>
					) : (
						<p className='text-xs text-red-500 mb-4'>
							Player not found. Please enter a valid email.
						</p>
					)}

					<select
						className='w-full p-2 border border-gray-300 rounded-md mb-4'
						name='game'
						id='game'
						required
						value={selectedGame}
						onChange={(e) => setSelectedGame(e.target.value)}
					>
						<option value=''>Select a game</option>
						{games.map((game) => (
							<option key={game.id} value={game.id}>
								{game.name}
							</option>
						))}
					</select>

					{selectedGame && (
						<>
							<CopyToClipboard
								onCopy={handleCopy}
								text={`${process.env.NEXT_PUBLIC_URL}/games/${gameId}`}
							>
								<div className='flex space-x-5 justify-between w-full text-sm text-gray-500 p-3 rounded-md bg-gray-100'>
									<p>{`${process.env.NEXT_PUBLIC_URL}/games/${gameId}`}</p>

									<p>
										{copied ? (
											"Copied!"
										) : (
											<Copy className='text-xs cursor-pointer hover:text-black' />
										)}
									</p>
								</div>
							</CopyToClipboard>
							<p className='text-xs text-right text-red-500'>
								Ensure you copy the link before starting the game.
							</p>
						</>
					)}

					<button
						type='submit'
						className='bg-blue-500 hover:bg-blue-600 text-sm text-white p-4 rounded-md cursor-pointer'
						disabled={!copied || buttonClicked || error}
					>
						{buttonClicked ? "Creating..." : "Create Game"}
					</button>
				</form>
			</main>
		</>
	);
}