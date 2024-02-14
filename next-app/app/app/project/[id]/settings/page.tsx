"use client";
import AccountButton from "@/app/_components/AccountButton";
import { CenterContainer } from "@/app/_components/CenterContainer";
import Title from "@/app/_components/Title";
import { ListItem, ListItemButton } from "@/app/_components/listItems";
import { ProjectContext } from "@/app/_lib/ProjectContext";
import { deleteProject } from "@/app/_lib/api";
import { AppDataContext } from "@/app/_lib/useUserData";
import { useRouter } from "next/navigation";
import { useState } from "react";

function BackComponent({ id }: { id: number }) {
	const router = useRouter();
	return (
		<ListItemButton onClick={() => router.push("/app/project/" + id)}>Back</ListItemButton>
	);
}

function DeleteProject({ id }: { id: number }) {
	const router = useRouter();
	const [deleting, setDeleting] = useState(false);
	if (deleting) {
		return <ListItem>Deleting project</ListItem>;
	}
	return (
		<AppDataContext.Consumer>
			{(appData) => (
				<ListItemButton
					onClick={() => {
						setDeleting(true);
						deleteProject(id)
							.then(() => {
								appData.update();
								router.push("/app");
							})
							.catch(() => setDeleting(false));
					}}
				>
					Delete Project
				</ListItemButton>
			)}
		</AppDataContext.Consumer>
	);
}

export default function Page() {
	return (
		<ProjectContext.Consumer>
			{({ project }) => (
				<CenterContainer>
					<Title>{project.name} Settings</Title>
					<DeleteProject id={project.id} />
					<BackComponent id={project.id} />
					<AccountButton />
				</CenterContainer>
			)}
		</ProjectContext.Consumer>
	);
}
