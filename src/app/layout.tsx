import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import "stream-chat-react/dist/css/v2/index.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stream Gaming App- Next.js",
  description: "A gaming plaform built with Next.js and Stream Chat SDK",
};

const inter = Bricolage_Grotesque({
	weight: ["300", "400", "500", "600", "700"],
	subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
