"use client";
import { CenterContainer } from "@/app/_components/CenterContainer";
import Title from "@/app/_components/Title";
import {
	DeleteListItem,
	ListItem,
	ListItemButton,
} from "@/app/_components/listItems";
import { ProjectContext, ProjectInterface } from "@/app/_lib/ProjectContext";
import { deleteProject } from "@/app/_lib/api";
import { AppDataContext } from "@/app/_lib/useUserData";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

function BackComponent({ id }: { id: number }) {
	const router = useRouter();
	return (
		<ListItemButton onClick={() => router.push("/app/project/" + id)}>
			Back
		</ListItemButton>
	);
}

function DeleteProject({ id }: { id: number }) {
	const router = useRouter();
	const [deleting, setDeleting] = useState(false);
	const { update } = useContext(AppDataContext);
	if (!deleting)
		return (
			<DeleteListItem
				text="Delete Project"
				confirmText="Are you sure you want to delete this project? It can't be undone!"
				action={() => {
					setDeleting(true);
					deleteProject(id)
						.then(() => {
							update();
							router.push("/app");
						})
						.catch(() => setDeleting(false));
				}}
			/>
		);
	return <ListItem>Deleting project...</ListItem>;
}

export default function Page() {
	const { project } = useContext(ProjectContext);
	return (
		<CenterContainer>
			<Title>{project.name} Settings</Title>
			<DeleteProject id={project.id} />
			<BackComponent id={project.id} />
		</CenterContainer>
	);
}
