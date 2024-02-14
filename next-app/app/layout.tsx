"use client"
import "./globals.css";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/icon.png" type="image/png" />
				<title>Taskkite</title>
			</head>
			<body className="bg-zinc-50 text-zinc-900 dark:text-zinc-50 dark:bg-zinc-800">
				<main>
					<SessionProvider>{children}</SessionProvider>
				</main>
			</body>
		</html>
	);
}
