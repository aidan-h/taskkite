"use client";
import { Formik, FormikErrors } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProjectData, nameSchema } from "../_lib/schemas";
import { fromZodError } from "zod-validation-error";
import { CenterContainer } from "../_components/CenterContainer";
import { SecondaryListItemButton } from "../_components/listItems";
import SubmitCancel from "../_components/SubmitCancel";
import { ActiveTaskList } from "../_components/TaskList";
import Title from "../_components/Title";
import { useAppDispatch } from "../_lib/hooks";
import useProjects from "../_lib/useProjects";
import { createProject } from "../_lib/slices/projectsSlice";

interface FormProps {
	name: string;
}

function CreateProjectForm({
	setCreateProject,
}: {
	setCreateProject: (value: boolean) => void;
}) {
	const dispatch = useAppDispatch();

	return (
		<Formik
			initialValues={{ name: "" }}
			validate={(values) => {
				const errors: FormikErrors<FormProps> = {};
				const results = nameSchema.safeParse(values.name.trim());
				if (results.success == false)
					errors.name = fromZodError(results.error).toString();
				return errors;
			}}
			onSubmit={(values, { setSubmitting }) => {
				dispatch(
					createProject(values.name),
				);
				setSubmitting(false);
				setCreateProject(false);
			}}
		>
			{({ values, errors, isSubmitting, handleSubmit, handleChange }) => {
				return (
					<form
						className="p-4 bg-slate-100 rounded shadow-lg w-full, relative"
						onSubmit={handleSubmit}
					>
						<input
							autoFocus={true}
							className="bg-slate-300 px-2 w-full mb-6 rounded py-2"
							name="name"
							type="text"
							value={values.name}
							onChange={handleChange}
						/>
						<SubmitCancel
							submit={handleSubmit}
							cancel={() => setCreateProject(false)}
							submitText="Create"
						/>
						<p className="mt-2 text-slate-700">
							{isSubmitting ? <p>Submitting form</p> : undefined}
							{errors.name}
						</p>
					</form>
				);
			}}
		</Formik>
	);
}

function CreateProjectButton() {
	const [createProject, setCreateProject] = useState(false);

	if (!createProject)
		return (
			<SecondaryListItemButton onClick={() => setCreateProject(true)}>
				Create Project
			</SecondaryListItemButton>
		);
	return <CreateProjectForm setCreateProject={setCreateProject} />;
}

function ProjectDueToday({
	data,
	id
}: {
	data: ProjectData;
	id: number;
}) {
	const router = useRouter();
	return (
		<div>
			<button
				className="block mb-4 text-xl font-bold underline-offset-8 decoration-indigo-400 decoration-4 underline"
				onClick={() => router.push("/app/project/" + id)}
			>
				{data.name}
			</button>
			<ActiveTaskList projectId={id} project={data} />
		</div>
	);
}

function DueToday() {
	const projects = useProjects()
	return projects.map((project) =>
		project.client ? (
			<ProjectDueToday key={project.client.data.id} data={project.client.data} id={project.client.data.id} />
		) : (
			<>loading</>
		),
	);
}
export default function Home() {
	return (
		<CenterContainer>
			<Title>Projects</Title>
			<DueToday />
			<CreateProjectButton />
		</CenterContainer>
	);
}
