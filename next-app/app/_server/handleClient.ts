import { db } from "@/app/_lib/mysql";
import {
  UserSession,
  getSession,
  unauthenticatedResponse,
} from "@/app/_lib/session";
import { Connection } from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";
import { ZodSchema } from "zod";

export function handleClientGetReq(
  action: (db: Connection, session: UserSession) => Promise<Response>,
) {
  return async (req: NextRequest, res: NextResponse) => {
    try {
      const session = await getSession(req, res);
      try {
        const connection = await db.getConnection();
        try {
          const resp = await action(connection, session);
          db.releaseConnection(connection);
          return resp;
        } catch (err) {
          console.error(err);
          db.releaseConnection(connection);
          return new Response(null, { status: 500 });
        }
      } catch (err) {
        console.error(err);
        return new Response(null, { status: 500 });
      }
    } catch (err) {
      return unauthenticatedResponse;
    }
  };
}

export function handleClientPostReq<T>(
  schema: ZodSchema<T>,
  action: (db: Connection, session: UserSession, data: T) => Promise<Response>,
) {
  return async (req: NextRequest, res: NextResponse) => {
    try {
      const session = await getSession(req, res);
      try {
        const data = schema.parse(await req.json());
        try {
          const connection = await db.getConnection();
          try {
            const result = await action(connection, session, data);
            db.releaseConnection(connection);
            return result;
          } catch (err) {
            console.error(err);
            db.releaseConnection(connection);
            return new Response(null, { status: 500 });
          }
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
