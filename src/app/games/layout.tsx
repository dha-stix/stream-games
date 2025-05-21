import type { Metadata } from "next";
import { AuthProvider } from "../(context)/AuthContext";

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
		<main>
			{children}
			</main>
		</AuthProvider>
		
	);
}