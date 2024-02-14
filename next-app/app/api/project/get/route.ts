import {
	AffectProject,
	affectProjectSchema,
} from "@/app/_lib/schemas";
import getProject from "@/app/_server/getProject";
import { handleClientPostReq } from "@/app/_server/handleClient";
import { isOfProject } from "@/app/_server/isOfProject";

export const POST = handleClientPostReq<AffectProject>(
	affectProjectSchema,
	async (db, session, req) => {
		if (!(await isOfProject(db, session.email, req.projectId)))
			return new Response("not of project", { status: 400 });
		return Response.json(await getProject(db, req.projectId));
	},
);
