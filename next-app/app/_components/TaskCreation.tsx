"use client";
import { CreateTaskEvent, descriptionSchema, nameSchema } from "@/app/_lib/data";
import { validateInputValue } from "@/app/_lib/formikHelpers";
import { Formik, FormikErrors } from "formik";
import { useState } from "react";

function Form({ close, createTask }: { close: () => void, createTask: (event: CreateTaskEvent) => void }) {
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
				createTask({
					name: values.name,
					description: values.description,
				})
				close()
				setSubmitting(false)
			}}
			initialValues={{ name: "Task name", description: "" }}
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
						Create Task
					</button>
				</form>
			)}
		</Formik>
	);
}

export default function TaskCreation({ createTask }: { createTask: (event: CreateTaskEvent) => void }) {
	const [active, setActive] = useState(false);
	if (active) return <Form close={() => setActive(false)} createTask={createTask} />;
	return <button onClick={() => setActive(true)}>Create task</button>;
}
