import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "./_components/authprovider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "To-Do App",
  description: "A to-do app by Aidan Hammond",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
