import { getDb } from "@/app/_lib/mysql";
import {
  UserSession,
  getSession,
  unauthenticatedResponse,
} from "@/app/_lib/session";
import { Connection } from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";
import { ZodSchema } from "zod";

export function handleUserGet(
  action: (db: Connection, session: UserSession) => Promise<Response>,
) {
  return async (req: NextRequest, res: NextResponse) => {
    try {
      const db = await getDb();
      const session = await getSession(req, res);
      try {
        return await action(db, session);
      } catch (err) {
        console.error(err);
        return new Response(null, { status: 500 });
      }
    } catch (err) {
      return unauthenticatedResponse;
    }
  };
}

export function handleUserPost<T>(
  schema: ZodSchema<T>,
  action: (db: Connection, session: UserSession, data: T) => Promise<Response>,
) {
  return async (req: NextRequest, res: NextResponse) => {
    try {
      const db = await getDb();
      const session = await getSession(req, res);
      try {
        const data = schema.parse(await req.json());
        try {
          return await action(db, session, data);
        } catch (err) {
          console.error(err);
          return new Response(null, { status: 500 });
        }
      } catch (err) {
        console.error(err);
        return new Response(null, { status: 400 });
      }
    } catch (err) {
      return unauthenticatedResponse;
    }
  };
}
