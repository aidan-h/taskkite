"use client";
import { useRouter } from "next/navigation";
import { AppData } from "../_lib/data";
import AccountButton from "./AccountButton";

export default function NavigationPanel({ appData }: { appData: AppData }) {
	const router = useRouter();
	return (
		<div className="fixed border-r-8 border-indigo-400 bg-slate-100 top-0 w-screen sm:h-screen flex sm:block sm:w-40">
			<AccountButton />
			<button
				className="mx-4 text-lg"
				onClick={() => router.push("/app")}
			>
				Projects
			</button>
			{appData.projects.map((project) => (
				<button
					className="sm:mx-4 sm:mt-4 invisible sm:visible"
					key={project.id}
					onClick={() => router.push("/app/project/" + project.id)}
				>
					{project.name}
				</button>
			))}
		</div>
	);
}
