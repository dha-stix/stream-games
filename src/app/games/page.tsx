"use client";
import { useCallback, useContext, useEffect, useState } from "react";
import { getLeaderboard, logoutUser } from "@/lib/serverfunctions";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ChatComponent from "../(components)/ChatComponent";
import LeaderBoard from "../(components)/Leaderboard";
import AuthContext from "../(context)/AuthContext";
import type { Leaderboard } from "../../../types";
import { Trophy } from "lucide-react";
import Link from "next/link";

export default function GamesPage() {
	const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);
	const { user } = useContext(AuthContext);

	const fetchLeaderboard = useCallback(async () => {
		const leaders = await getLeaderboard();
		if (!leaders) {
			console.error("Failed to fetch leaderboard");
			return;
		}
		setLeaderboard(leaders as Leaderboard[]);
	}, []);

	useEffect(() => {
		fetchLeaderboard();
	}, [fetchLeaderboard]);

	return (
		
			<div>
				<Navigation leaderboard={leaderboard} />

				<section className='px-4 py-4 border-[4px] rounded-lg border-gray-200'>
					<ChatComponent user={user!} />
				</section>
			</div>
	);
}

const Navigation = ({ leaderboard }: { leaderboard: Leaderboard[] }) => {
	return (
		<nav className='w-full md:px-8 px-2 py-4 flex items-center justify-between h-[10vh] border-b-[1px] border-gray-300'>
			<Link href='/' className='font-bold text-2xl'>
				StreamGame
			</Link>

			<div className='flex items-center gap-2'>
				<Dialog>
					<DialogTrigger asChild>
						<Trophy className='bg-white text-sm text-green-600 hover:underline rounded-md cursor-pointer hover:text-blue-500' />
					</DialogTrigger>
					<LeaderBoard leaderboard={leaderboard.slice(0, 7)} />
				</Dialog>

				<Link
					href='/games/request'
					className='bg-blue-500 text-sm text-white px-4 py-2 rounded-md cursor-pointer'
				>
					Game Requests
				</Link>

				<button
					className='bg-red-600 text-sm hover:bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer'
					onClick={logoutUser}
				>
					Log Out
				</button>
			</div>
		</nav>
	);
};