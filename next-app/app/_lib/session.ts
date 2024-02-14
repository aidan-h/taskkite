import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export const unauthenticatedResponse = new Response("Not authenticated", {
  status: 400,
});

export interface UserSession {
  email: string;
  name: string;
}

export async function getSession(
  req: NextRequest,
  res: NextResponse,
): Promise<UserSession> {
  const session = (await getServerSession(
    req as unknown as NextApiRequest,
    {
      ...res,
      getHeader: (name: string) => res.headers?.get(name),
      setHeader: (name: string, value: string) => res.headers?.set(name, value),
    } as unknown as NextApiResponse,
    authOptions,
  )) as null | { user: UserSession }; //TODO validate data
  if (session) return session.user;
  throw "couldn't authenticate";
}
