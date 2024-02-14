"use client";
import { useRouter } from "next/navigation";
import { AppData } from "../_lib/data";
import AccountButton from "./AccountButton";

export default function NavigationPanel({ appData }: { appData: AppData }) {
	const router = useRouter();
	return (
		<div className="fixed border-b-8 sm:border-b-0 sm:border-r-8 border-indigo-400 bg-slate-100 top-0 w-screen sm:h-screen flex sm:block sm:w-40">
			<AccountButton />
			<button
				className="mx-4 text-xl mb-2 font-semibold underline-offset-8 decoration-indigo-400 decoration-4 underline"
				onClick={() => router.push("/app")}
			>
				Projects
			</button>
			{appData.projects.map((project) => (
				<button
					className="sm:mx-4 font-medium invisible sm:visible"
					key={project.id}
					onClick={() => router.push("/app/project/" + project.id)}
				>
					{project.name}
				</button>
			))}
		</div>
	);
}
