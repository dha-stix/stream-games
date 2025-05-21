import type { Metadata } from "next";
import { AuthProvider } from "@/app/(context)/AuthContext";
import { ChannelProvider } from "@/app/(context)/ChannelContext";

export const metadata: Metadata = {
	title: "Games Arena | StreamGame",
	description: "Dashboard for your games. Connect with others and play games.",
};

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<AuthProvider>
			<ChannelProvider>
                <main>
                    {children}
				</main>
				</ChannelProvider>
		</AuthProvider>
		
	);
}