"use client";
import { Formik, FormikErrors } from "formik";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { ProjectIdentifier, nameSchema } from "../_lib/data";
import { fromZodError } from "zod-validation-error";
import { stringify } from "querystring";
import { AppDataContext } from "../_lib/useUserData";
import { createProject } from "../_lib/api";

function ProjectItem({ project }: { project: ProjectIdentifier }) {
	const router = useRouter();
	return (
		<button
			className="text-center text-lg p-4 rounded shadow hover:shadow-lg transition visible bg-slate-100 w-full block mb-6"
			onClick={() => router.push("/app/project/" + project.id)}
		>
			{project.name}
		</button>
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
				if (!results.success)
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
					<form className="p-4 bg-slate-100 rounded shadow-lg w-full, relative" onSubmit={handleSubmit}>
						{err}
						<input
							className="bg-slate-300 px-2 w-full rounded py-2"
							name="name"
							type="text"
							value={values.name}
							onChange={handleChange}
						/>
						<br />
						<div className="absolute right-6 top-6">
							<button className="px-2 mx-3 rounded shadow" onClick={() => setCreateProject(false)}>Cancel</button>
							<button className="bg-slate-500 px-2 rounded shadow text-slate-100" type="submit" disabled={isSubmitting}>
								Create
							</button>
						</div>
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
			<button
				className="transition hover:shadow-lg text-center text-lg rounded shadow p-4 bg-slate-200 w-full block mb-6"
				onClick={() => setCreateProject(true)}
			>
				Create Project
			</button>
		);
	return <CreateProjectForm setCreateProject={setCreateProject} />;
}

export default function Home() {
	const router = useRouter();

	return (
		<div className="max-w-lg mt-24 mx-auto">
			<ProjectList></ProjectList>
			<CreateProjectButton></CreateProjectButton>
			<br />
			<button
				className="bg-slate-500 rounded-full p-6 absolute left-6 top-6"
				onClick={() => router.push("/app/account")}
			></button>
		</div>
	);
}
