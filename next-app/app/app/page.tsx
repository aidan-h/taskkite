"use client";
import { Formik, FormikErrors } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProjectData, nameSchema } from "../_lib/data";
import { fromZodError } from "zod-validation-error";
import { stringify } from "querystring";
import { createProject } from "../_lib/api";
import { CenterContainer } from "../_components/CenterContainer";
import {
	SecondaryListItemButton,
} from "../_components/listItems";
import SubmitCancel from "../_components/SubmitCancel";
import { ActiveTaskList } from "../_components/TaskList";
import Title from "../_components/Title";
import { useAppSelector } from "../_lib/hooks";
import { useDispatch } from "react-redux";
import { Project, addProject } from "../_lib/slices/projectsSlice";

interface FormProps {
	name: string;
}

function CreateProjectForm({
	setCreateProject,
}: {
	setCreateProject: (value: boolean) => void;
}) {
	const [err, setErr] = useState(null as null | string);
	const appData = useAppSelector((data) => data);
	const dispatch = useDispatch();

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
					.then(({ id }) => {
						dispatch(addProject({ data: { tasks: [], historyCount: 0, taskCount: 0 }, name: values.name, id: id, owner: appData.accountSettings.email }));
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

function ProjectDueToday({ data, project }: { project: Project, data: ProjectData }) {
	const router = useRouter()
	return <div>
		<button className="block mb-4 text-xl font-bold underline-offset-8 decoration-indigo-400 decoration-4 underline" onClick={() => router.push("/app/project/" + project.id)}>{project.name}</button>
		<ActiveTaskList projectId={project.id} project={data} />
	</div>
}

function DueToday() {
	const projects = useAppSelector((data) => data.projects)
	return projects.map((project) => project.data ? <ProjectDueToday key={project.id} data={project.data} project={project} /> : <>loading</>)

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
