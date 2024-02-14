"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className + " bg-slate-200"}>
				<main>
					<SessionProvider>{children}</SessionProvider>
				</main>
			</body>
		</html>
	);
}
