"use client"
import { createContext, useState } from "react";
import { Channel } from "stream-chat";

export const ChannelContext = createContext<{
    channel: Channel | null;
    setChannel: (channel: Channel | null) => void;
}>({
    channel: null,
    setChannel: () => {},
});


export const ChannelProvider = ({ children }: { children: React.ReactNode }) => {
    const [channel, setChannel] = useState<Channel | null>(null);

    return (
        <ChannelContext.Provider value={{ channel, setChannel }}>
            {children}
        </ChannelContext.Provider>
    );
};