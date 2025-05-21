import { useCreateChatClient } from "stream-chat-react";
import { createToken } from "../../../actions/stream.action";
import { useCallback } from "react";
import type { Leaderboard } from "../../../types";

export const useGetStreamClient = (
	user: Leaderboard
) => {
	const tokenProvider = useCallback(async () => {
		return await createToken(user);
	}, [user]);

	const client = useCreateChatClient({
		apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
		tokenOrProvider: tokenProvider,
		userData: { id: user.id, name: user.nickname, image: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.nickname}` },
	});

	if (!client) return { client: null };

	return { client };
};