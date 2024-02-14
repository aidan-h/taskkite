"use client";
import { useRouter } from "next/navigation";
import AccountButton from "./AccountButton";
import { useAppSelector } from "../_lib/hooks";

export default function NavigationPanel() {
	const router = useRouter();
	const projects = useAppSelector((state) => state.projects.projects);

	return (
		<div className="fixed border-b-8 sm:border-b-0 sm:border-r-8 border-indigo-400 bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-50 top-0 w-screen sm:h-screen flex sm:block sm:w-40">
			<AccountButton />
			<button
				className="mx-4 text-xl mb-2 font-semibold underline-offset-8 decoration-indigo-400 decoration-4 underline"
				onClick={() => router.push("/app")}
			>
				Projects
			</button>
			{projects.map((project) => (
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
