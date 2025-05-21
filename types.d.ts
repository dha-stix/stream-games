/* eslint-disable @typescript-eslint/no-explicit-any */
import { Channel } from "stream-chat";

type Choice = "rock" | "paper" | "scissors";

interface Leaderboard { 
    id: string;
    nickname: string;
    email: string;
    score: number;
}

interface Game {
    id: string;
    type: string;
    players: Leaderboard[];
}

interface GamePageProps {
	gameData: Game;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	members: any[];
	playersReady: boolean;
	user: Leaderboard;
	channel: Channel;
	gameId: string;
}
