"use client";
import { Formik, FormikErrors } from "formik";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { ProjectIdentifier, nameSchema } from "../_lib/data";
import { fromZodError } from "zod-validation-error";
import { stringify } from "querystring";
import { AppDataContext } from "../_lib/useUserData";
import { createProject } from "../_lib/api";
import { CenterContainer } from "../_components/CenterContainer";
import {
	SecondaryListItemButton,
	ListItemButton,
} from "../_components/listItems";
import SubmitCancel from "../_components/SubmitCancel";

function ProjectItem({ project }: { project: ProjectIdentifier }) {
	const router = useRouter();
	return (
		<ListItemButton onClick={() => router.push("/app/project/" + project.id)}>
			{project.name}
		</ListItemButton>
	);
}

function ProjectList() {
	const appData = useContext(AppDataContext);
	return (
		<div>
			{appData.data.projects.map((project) => (
				<ProjectItem key={project.id} project={project} />
			))}
		</div>
	);
}

interface FormProps {
	name: string;
}

function CreateProjectForm({
	setCreateProject,
}: {
	setCreateProject: (value: boolean) => void;
}) {
	const [err, setErr] = useState(null as null | string);
	const appData = useContext(AppDataContext);

	return (
		<Formik
			initialValues={{ name: "" }}
			validate={(values) => {
				const errors: FormikErrors<FormProps> = {};
				const results = nameSchema.safeParse(values.name);
				if (results.success == false)
					errors.name = fromZodError(results.error).toString();
				return errors;
			}}
			onSubmit={(values, { setSubmitting }) => {
				createProject(values.name)
					.then(() => {
						appData.update();
						setSubmitting(false);
						setCreateProject(false);
					})
					.catch((err) => {
						setErr(stringify(err));
						setSubmitting(false);
					});
			}}
		>
			{({ values, errors, isSubmitting, handleSubmit, handleChange }) => {
				return (
					<form
						className="p-4 bg-slate-100 rounded shadow-lg w-full, relative"
						onSubmit={handleSubmit}
					>
						{err}
						<input
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

export default function Home() {
	return (
		<CenterContainer>
			<ProjectList />
			<CreateProjectButton />
		</CenterContainer>
	);
}
