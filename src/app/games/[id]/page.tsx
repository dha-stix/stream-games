"use client";
import { useContext, useEffect, useCallback, useState, useMemo } from "react";
import { useGetStreamClient } from "@/app/hooks/useGetStreamClient";
import { ChannelContext } from "@/app/(context)/ChannelContext";
import type { Channel as ChannelType } from "stream-chat";
import WinnerModal from "@/app/(components)/WinnerModal";
import { useParams, useRouter } from "next/navigation";
import AuthContext from "@/app/(context)/AuthContext";
import { getGameById } from "@/lib/serverfunctions";
import RockPaper from "@/app/(components)/RockPaper";
import TicTacToe from "@/app/(components)/TicTacToe";
import { doc, onSnapshot } from "firebase/firestore";
import GamesNav from "@/app/(components)/GamesNav";
import { Chat, Channel } from "stream-chat-react";
import { Game } from "../../../../types";
import { Loader2 } from "lucide-react";
import db from "@/lib/firebase";

export default function GamePlay() {
	const { id } = useParams<{ id: string }>();
	const { user } = useContext(AuthContext);
	const { client } = useGetStreamClient(user!);
	const [game, setGame] = useState<Game | null>(null);
	const { channel, setChannel } = useContext(ChannelContext);
	const router = useRouter();

	const getChannel = useCallback(async () => {
		if (!client || !id) return;
		const [channel, { game }] = await Promise.all([
			client.queryChannels({
				id: id,
			}),
			getGameById(id),
		]);
		if (!channel || !game || !user) return router.back();

		if (!channel[0].state.members[user.id as string]) {
			return router.back();
		}
		setGame(game as Game);
		setChannel(channel[0]);
	}, [client, setChannel, id, router, user]);

	useEffect(() => {
		getChannel();
	}, [getChannel]);

	useEffect(() => {
		const unsubscribe = onSnapshot(doc(db, "games", id), (docSnap) => {
			if (docSnap.exists()) {
				setGame({ id: docSnap.id, ...docSnap.data() } as Game);
			}
		});

		return () => unsubscribe();
	}, [id]);

	if (!client || !user || !channel) {
		return (
			<div className='flex items-center justify-center h-screen'>
				<Loader2 className='animate-spin text-blue-500' />
			</div>
		);
	}

	return (
		<Chat client={client}>
			<Channel channel={channel}>
				<Page channel={channel} game={game!} />
			</Channel>
		</Chat>
	);
}

const Page = ({ channel, game }: { channel: ChannelType; game: Game }) => {
	// Lazy init so we read watcher_count only once on mount
	const [playersCompleted, setPlayersCompleted] = useState<boolean>(() =>
		Boolean(channel.state.watcher_count === 2)
	);
	const [displayWinner, setDisplayWinner] = useState<boolean>(false);
	const [winner, setWinner] = useState<string>("");

	useEffect(() => {
		if (!channel) return;

		const handleWatchChange = (event: { watcher_count: number }) => {
			setPlayersCompleted(event.watcher_count === 2);
		};

		// Subscribe to both start/stop in one go
		// @ts-expect-error: channel.on may not be typed for custom events
		channel.on("user.watching.start", handleWatchChange);
		// @ts-expect-error: channel.on may not be typed for custom events
		channel.on("user.watching.stop", handleWatchChange);

		// Cleanup on channel change or unmount
		return () => {
			// @ts-expect-error: channel.off may not be typed for custom events
			channel.off("user.watching.start", handleWatchChange);
			// @ts-expect-error: channel.off may not be typed for custom events
			channel.off("user.watching.stop", handleWatchChange);
		};
	}, [channel]);

	// Memoize which game component to render
	const GameComponent = useMemo(() => {
		return game.type === "rock-paper-scissors" ? (
			<RockPaper
				game={game}
				playersCompleted={playersCompleted}
				setDisplayWinner={setDisplayWinner}
				setWinner={setWinner}
			/>
		) : (
			<TicTacToe
				game={game}
				playersCompleted={playersCompleted}
				setDisplayWinner={setDisplayWinner}
				setWinner={setWinner}
			/>
		);
	}, [game, playersCompleted]);

	return (
		<div className='flex flex-col min-h-screen w-full'>
			<GamesNav />
			{displayWinner && winner ? (
				<main>
					<WinnerModal
						winner={winner}
						setWinner={setWinner}
						setDisplayWinner={setDisplayWinner}
					/>
				</main>
			) : (
				<main>{GameComponent}</main>
			)}
		</div>
	);
};