"use client";
import { useRouter } from "next/navigation";
import { AppData } from "../_lib/data";
import AccountButton from "./AccountButton";

export default function NavigationPanel({ appData }: { appData: AppData }) {
	const router = useRouter();
	return (
		<div className="fixed top-0 w-screen sm:h-screen flex sm:block sm:w-40 bg-slate-600">
			<AccountButton />
			<button
				className="mx-4 text-lg text-slate-300"
				onClick={() => router.push("/app")}
			>
				Projects
			</button>
			{appData.projects.map((project) => (
				<button
					className="sm:mx-4 sm:mt-4 text-slate-50 invisible sm:visible"
					key={project.id}
					onClick={() => router.push("/app/project/" + project.id)}
				>
					{project.name}
				</button>
			))}
		</div>
	);
}
