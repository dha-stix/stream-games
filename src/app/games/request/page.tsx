"use client";
import { useState, useContext, useCallback, useEffect } from "react";
import { getLeaderboard } from "@/lib/serverfunctions";
import AuthContext from "@/app/(context)/AuthContext";
import CreateGame from "@/app/(components)/CreateGame";
import { Leaderboard } from "../../../../types";
import GamesNav from "@/app/(components)/GamesNav";
import { useGetStreamClient } from "@/app/hooks/useGetStreamClient";
import { Loader2 } from "lucide-react";
import { Chat } from "stream-chat-react";

export default function CreateGamePage() {
	const [users, setUsers] = useState<Leaderboard[]>([]);
	const { user } = useContext(AuthContext);
	const { client } = useGetStreamClient(user!);

	const fetchLeaderboard = useCallback(async () => {
		const users = await getLeaderboard();
		if (!users) {
			console.error("Failed to fetch leaderboard");
			return;
		}
		setUsers(users as Leaderboard[]);
	}, []);

	useEffect(() => {
		fetchLeaderboard();
	}, [fetchLeaderboard]);

	if (!client || !user) {
		return (
			<div className='flex items-center justify-center h-screen'>
				<Loader2 className='animate-spin text-blue-500' />
			</div>
		);
	}

	return (
		<Chat client={client}>
			<div>
				<GamesNav />
				<CreateGame users={users} user={user!} client={client} />
			</div>
		</Chat>
	);
}