/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { calculateWinner } from "@/lib/utils";
import { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { Game } from "../../../types";
import { ChannelContext } from "../(context)/ChannelContext";
import AuthContext from "../(context)/AuthContext";
import { updatePlayerScore } from "@/lib/serverfunctions";

export default function Board({
	game,
	setWinner,
	setDisplayWinner,
}: {
	game: Game;
	setWinner: React.Dispatch<React.SetStateAction<string>>;
	setDisplayWinner: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [cells, setCells] = useState<string[]>(Array(9).fill(""));
	const playerX = useMemo(
		() => ({ sign: "X", ...game?.players?.[0] }),
		[game?.players]
	);
	const playerO = useMemo(
		() => ({ sign: "O", ...game?.players?.[1] }),
		[game?.players]
	);
	const { channel } = useContext(ChannelContext);
	const [xIsNext, setXIsNext] = useState(true);
	const { user } = useContext(AuthContext);
	const winner = useMemo(() => calculateWinner(cells), [cells]);

	// Determine if signed-in user is player X
	const isPlayerX = user?.id === game.players[0].id;
	// Check if it's this user's turn
	const isMyTurn = (xIsNext && isPlayerX) || (!xIsNext && !isPlayerX);

	// Handle incoming move events from Stream
	useEffect(() => {
		if (!channel) return;
		const handleMoveEvent = (event: any) => {
			const { index, sign } = event.data;
			setCells((prev) => {
				const updated = [...prev];
				updated[index] = sign;
				return updated;
			});
			// Update turn based on sign
			setXIsNext(sign === "O");
		};

		// Listen for custom 'game-move' events
		// @ts-expect-error: channel.on may not be typed for custom events
		channel.on("game-move", handleMoveEvent);

		// Cleanup listener on unmount
		return () => {
			// @ts-expect-error: channel.off may not be typed for custom events
			channel.off("game-move", handleMoveEvent);
		};
	}, [channel]);

	// Handle a cell click
	const handleClick = async (index: number) => {
		if (!channel) return;
		// Ignore if cell filled, game over, or not this user's turn
		if (cells[index] || winner || !isMyTurn) return;

		// Determine current player
		const currentPlayer = xIsNext ? playerX : playerO;
		const nextCells = [...cells];
		nextCells[index] = currentPlayer.sign;

		// Update local board and turn
		setCells(nextCells);
		setXIsNext(!xIsNext);

		// Send move event to other player
		await channel.sendEvent({
			// @ts-expect-error: channel.sendEvent may not be typed for custom events
			type: "game-move",
			data: { index, sign: currentPlayer.sign },
		});
	};

	const updateScoreAndShowWinner = useCallback(async () => {
		if (!winner) return;
		const winnerObject = winner === playerX.sign ? playerX : playerO;
		setWinner(winnerObject.nickname);
		setDisplayWinner(true);
		await updatePlayerScore(winnerObject.id, game.id);
	}, [winner, playerX, playerO, game.id, setWinner, setDisplayWinner]);

	useEffect(() => {
		updateScoreAndShowWinner();
	}, [updateScoreAndShowWinner]);

	return (
		<div className='grid grid-cols-3 gap-4'>
			{cells.map((value, index) => (
				<Cell key={index} value={value} onClick={() => handleClick(index)} />
			))}

			<p className='text-blue-500'>
				{cells.every(Boolean)
					? "It's a draw!"
					: `Next: ${xIsNext ? playerX.nickname : playerO.nickname}`}
			</p>
		</div>
	);
}

const Cell = ({
	value,
	onClick,
	disabled = false,
}: {
	value: string;
	onClick: () => void;
	disabled?: boolean;
}) => {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`w-24 h-24 flex items-center justify-center rounded-md border border-gray-400 m-[1px]
        ${
					disabled
						? "bg-red-200 cursor-not-allowed"
						: "bg-gray-200 hover:bg-gray-100"
				}`}
		>
			<p className='text-2xl font-bold'>{value}</p>
		</button>
	);
};