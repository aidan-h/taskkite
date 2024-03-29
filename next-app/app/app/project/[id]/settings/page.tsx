"use client";
import { CenterContainer } from "@/app/_components/CenterContainer";
import Title from "@/app/_components/Title";
import {
	DeleteListItem,
	ListItem,
	ListItemButton,
} from "@/app/_components/listItems";
import ProjectPageContext from "@/app/_lib/ProjectPageContext";
import { deleteProject } from "@/app/_lib/api";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";

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
	const dispatch = useDispatch();
	if (!deleting)
		return (
			<DeleteListItem
				text="Delete Project"
				confirmText="Are you sure you want to delete this project? It can't be undone!"
				action={() => {
					setDeleting(true);
					deleteProject(id);
					//TODO delete Project
				}}
			/>
		);
	return <ListItem>Deleting project...</ListItem>;
}

export default function Page() {
	const project = useContext(ProjectPageContext);
	return (
		<CenterContainer>
			<Title>{project.name} Settings</Title>
			<DeleteProject id={project.id} />
			<BackComponent id={project.id} />
		</CenterContainer>
	);
}
