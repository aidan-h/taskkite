"use client";
import {
	CreateTaskEvent,
	Task,
	descriptionSchema,
	nameSchema,
} from "@/app/_lib/data";
import { validateInputValue } from "@/app/_lib/formikHelpers";
import { Formik, FormikErrors } from "formik";
import { useState } from "react";
import { EditTask } from "./TaskList";
import { CreateListItemButton } from "./listItems";
import SubmitCancel from "./SubmitCancel";

function Form({
	close,
	onSubmit,
	text,
	task,
}: {
	task: Task;
	text: string;
	close: () => void;
	onSubmit: (task: Task) => void;
}) {
	return (
		<Formik
			validate={(values) => {
				let errors: FormikErrors<{ name: string; description: string }> = {};
				validateInputValue(nameSchema, values.name, errors, "name");
				validateInputValue(
					descriptionSchema,
					values.description,
					errors,
					"description",
				);
				return errors;
			}}
			onSubmit={(values, { setSubmitting }) => {
				onSubmit({
					id: task.id,
					archived: task.archived,
					completed: task.completed,
					labels: task.labels,
					name: values.name,
					description: values.description,
				});
				close();
				setSubmitting(false);
			}}
			initialValues={{ name: task.name, description: task.description }}
		>
			{({ handleSubmit, isSubmitting, handleChange, values, errors }) => (
				<form className="shadow-lg bg-slate-50 mb-4 relative rounded p-6" onSubmit={handleSubmit}>
					<input
						type="text"
						className="mb-4 py-1 pl-2 w-full bg-slate-50 rounded shadow"
						onChange={handleChange}
						value={values.name}
						name="name"
					/>
					<br />
					{errors.name}
					<textarea
						className="w-full pl-2 mb-10 bg-slate-50 rounded shadow"

						onChange={handleChange}
						value={values.description}
						name="description"
					/>
					{errors.description}
					<br />
					<SubmitCancel isSubmitting={isSubmitting} cancel={close} submitText={text} />
				</form>
			)}
		</Formik>
	);
}

export function TaskEditing({
	editTask,
	task,
	close,
}: {
	close: () => void;
	task: Task;
	editTask: EditTask;
}) {
	return <Form text="Save" task={task} close={close} onSubmit={editTask} />;
}

export default function TaskCreation({
	createTask,
}: {
	createTask: (event: CreateTaskEvent) => void;
}) {
	const [active, setActive] = useState(false);
	if (active)
		return (
			<Form
				text="Create"
				task={{ name: "New Task", id: -1, archived: false, completed: false }}
				close={() => setActive(false)}
				onSubmit={(task) =>
					createTask({
						name: task.name,
						description: task.description,
						labels: task.labels,
					})
				}
			/>
		);
	return <CreateListItemButton onClick={() => setActive(true)}>Create task</CreateListItemButton>;
}
