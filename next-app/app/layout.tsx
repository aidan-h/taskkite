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
			</head>
			<body className="bg-slate-50">
				<main>
					<SessionProvider>{children}</SessionProvider>
				</main>
			</body>
		</html>
	);
}
