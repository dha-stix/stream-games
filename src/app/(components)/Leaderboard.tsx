"use client";
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type{ Leaderboard } from "../../../types";

export default function LeaderBoard({ leaderboard }: { leaderboard: Leaderboard[] }) {
	return (
		<DialogContent className='sm:max-w-4xl'>
			<DialogHeader>
				<DialogTitle className='text-2xl text-blue-500'>
					Leader Board
				</DialogTitle>
				<DialogDescription>See the top players in the game.</DialogDescription>
			</DialogHeader>
			<table className='w-full border-collapse'>
				<thead>
					<tr>
						<th className='border-b-2 w-1/3 border-gray-300 p-4 text-red-500 text-left'>
							Player
						</th>
						<th className='border-b-2 w-1/3 border-gray-300 p-4 text-red-500 text-left'>
							Score
						</th>
					</tr>
				</thead>
				<tbody>
					{leaderboard.map((player) => (
						<tr key={player.id} className='border-b border-gray-300'>
							<td className='border-b w-1/3 text-xs border-gray-300 p-3 text-green-600'>
								{`@${player.nickname}`}
							</td>
							<td className='border-b w-1/3 text-xs border-gray-300 p-3'>
								{player.score}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</DialogContent>
	);
}