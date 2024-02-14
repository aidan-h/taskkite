
import { nameSchema } from "@/app/_lib/schemas";
import createProject from "@/app/_server/createProject";
import getCount from "@/app/_server/getCount";
import { handleClientPostReq } from "@/app/_server/handleClient";
import { z } from "zod";
export const POST = handleClientPostReq(
	z.object({ name: nameSchema }),
	async (db, session, data) => {
		return Response.json(await createProject(db, data.name, session.email, await getCount(db, "user", "project_count", "email", session.email)));
	},
);
