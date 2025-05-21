"use server";
import { StreamChat } from "stream-chat";
import { Leaderboard } from "../types";

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const STREAM_API_SECRET = process.env.STREAM_SECRET_KEY!;
const CREATOR_ID = process.env.CHANNELS_CREATOR_ID!

// 👇🏻 -- For Stream Chat  --
const serverClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);

export async function createToken(
	user: Leaderboard
): Promise<string> {
	if (!user) throw new Error("User is not authenticated");
	return serverClient.createToken(user.id);
}

export const createStreamUser = async (
	id: string,
	name: string,
	image: string
) => {
	const { users } = await serverClient.queryUsers({ id });
	if (users.length > 0) return users[0];

	const user = await serverClient.upsertUser({
		id,
		name,
		image,
	});

	return user;
};

export async function addUserToChannels(channelIds: string[], userId: string) {
  try {
    // Step 1: Query all channels by IDs
    const filter = {
      id: { $in: channelIds },
      type: "messaging",
    };
    const sort = { last_message_at: -1 };
    // @ts-expect-error: sort is not typed
    const channels = await serverClient.queryChannels(filter, sort);

    // Step 2: Determine which channels the user is already a member of
    const alreadyMemberChannelIds = channels
      .filter((channel) => channel.state.members[userId])
      .map((channel) => channel.id);

    // Step 3: Identify channels where the user is not a member
    const channelsToAdd = channelIds.filter(
      (id) => !alreadyMemberChannelIds.includes(id)
	);
	  console.log({alreadyMemberChannelIds, channelsToAdd, userId})

    // Step 4: Add the user to the channels they're not a member of
    for (const channelId of channelsToAdd) {
      const channel = serverClient.channel("messaging", channelId);
      await channel.addMembers([userId]);
    }

    return {
      success: true,
      message: "User added to channels successfully",
      addedChannels: channelsToAdd,
      alreadyMemberChannels: alreadyMemberChannelIds,
      error: null,
    };
  } catch (error) {
    console.error("Error adding user to channels:", error);
    return {
      success: false,
      error: "Failed to add user to channels",
      addedChannels: [],
      alreadyMemberChannels: [],
      message: null,
    };
  }
}

export const getGameChannels = async (userId : string) => { 
	try {
		const filter = { created_by_id: CREATOR_ID, type: "messaging" };
		const sort = [{ last_message_at: -1 }];
		
		const channels = await serverClient.queryChannels(filter, sort);
		const channelIds = channels.map((channel) => channel.id);	

		if (!channelIds || channelIds.length === 0) { 
			return {
				success: false,
				message: "No channels found",
				error: null,
			};
		}
		const result = await addUserToChannels(channelIds as string[], userId);
		return result
		
	} catch (error) {
		console.error("Error fetching channels:", error);
		throw new Error("Failed to fetch channels");
	}
}

