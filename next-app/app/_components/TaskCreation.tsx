"use client";
import { CreateTaskEvent, Task, descriptionSchema, nameSchema } from "@/app/_lib/data";
import { validateInputValue } from "@/app/_lib/formikHelpers";
import { Formik, FormikErrors } from "formik";
import { useState } from "react";
import { EditTask } from "./TaskList";

function Form({ close, onSubmit, task }: { task: Task, close: () => void, onSubmit: (task: Task) => void }) {
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
				})
				close()
				setSubmitting(false)
			}}
			initialValues={{ name: task.name, description: task.description }}
		>
			{({ handleSubmit, isSubmitting, handleChange, values, errors }) => (
				<form onSubmit={handleSubmit}>
					<p>Name</p>
					<br />
					<input
						type="text"
						onChange={handleChange}
						value={values.name}
						name="name"
					/>
					<br />
					{errors.name}
					<p>Description</p>
					<br />
					<input
						type="text"
						onChange={handleChange}
						value={values.description}
						name="description"
					/>
					{errors.description}
					<br />
					<button type="submit" disabled={isSubmitting}>
						Submit
					</button>
				</form>
			)}
		</Formik>
	);
}

export function TaskEditing({ editTask, task, close }: { close: () => void, task: Task, editTask: EditTask }) {
	return <Form task={task} close={close} onSubmit={editTask} />;
}

export default function TaskCreation({ createTask }: { createTask: (event: CreateTaskEvent) => void }) {
	const [active, setActive] = useState(false);
	if (active) return <Form task={{ name: "New Task", id: -1 }} close={() => setActive(false)} onSubmit={(task) => createTask({
		name: task.name,
		description: task.description,
		labels: task.labels
	})} />;
	return <button onClick={() => setActive(true)}>Create task</button>;
}
