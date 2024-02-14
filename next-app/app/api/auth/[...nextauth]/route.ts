import { authOptions } from "@/app/_server/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);
export const POST = handler;
export const GET = handler;
