import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Choice } from "../../types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const calculateWinner = (cells: string[]) => {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (const [a, b, c] of lines) {
		if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
			return cells[a];
		}
	}
	return null;
};

export const getRPSWinner = ({ player1Ans, player1Name, player2Ans, player2Name }: {
	player1Ans: Choice;
	player1Name: string;
	player2Ans: Choice;
	player2Name: string;

}): string => {
	if (player1Ans === player2Ans) return "It's a draw!";

	const rules: Record<Choice, Choice> = {
		rock: "scissors",
		paper: "rock",
		scissors: "paper",
	};

	return rules[player1Ans] === player2Ans? `${player1Name}`: `${player2Name}`;
};

export const generateGameUrl = () => Math.random().toString(36).substring(2, 9);

export const games: { name: string; id: string }[] = [
	{
		name: "Rock Paper Scissors",
		id: "rock-paper-scissors",
	},
	{
		name: "Tic Tac Toe",
		id: "tic-tac-toe",
	},
];

export const choices: Choice[] = ["rock", "paper", "scissors"];