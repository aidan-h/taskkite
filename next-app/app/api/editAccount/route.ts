import { editUserSchema } from "@/app/_lib/data";
import { handleClientPostReq } from "@/app/_lib/handleClient";

const EDIT_USER_STATEMENT = "UPDATE user SET name = ? WHERE email = ?";
export const POST = handleClientPostReq(
  editUserSchema,
  async (db, session, req) => {
    await db.execute(EDIT_USER_STATEMENT, [req.name, session.email]);
    return Response.json("Updated account");
  },
);
