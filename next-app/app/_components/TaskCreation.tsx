"use client";
import {
	AddLabelEvent,
	DeleteLabelEvent,
	Task,
	descriptionSchema,
	nameSchema,
} from "@/app/_lib/data";
import { validateInputValue } from "@/app/_lib/formikHelpers";
import { Formik, FormikErrors } from "formik";
import { ReactNode, useState } from "react";
import { SecondaryListItemButton } from "./listItems";
import SubmitCancel from "./SubmitCancel";
import { ProjectContext } from "../_lib/ProjectContext";
import SecondaryButton from "./SecondaryButton";

function Form({
	close,
	onSubmit,
	text,
	task,
	children,
}: {
	task: Task;
	text: string;
	close: () => void;
	onSubmit: (task: Task) => void;
	children?: ReactNode,
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
			{({ handleSubmit, submitForm, handleChange, values, errors }) => (
				<div
					className="shadow-lg bg-slate-50 mb-4 relative rounded p-6"
				>
					{children}
					<form
						onSubmit={handleSubmit}
					>
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
						<SubmitCancel submit={submitForm} cancel={close} submitText={text} />
					</form>
				</div>
			)}
		</Formik>
	);
}
export type AddLabel = (e: AddLabelEvent) => void;
export type DeleteLabel = (e: DeleteLabelEvent) => void;

export function AddLabelForm({ task, cancel }: { task: Task; cancel: () => void }) {
	return <ProjectContext.Consumer>{({ addLabel }) => (<Formik initialValues={{ name: "" }} validate={(values) => {
		let errors: FormikErrors<{ name: string }> = {}
		validateInputValue(nameSchema, values.name, errors, "name");
		return errors
	}} onSubmit={(values, { setSubmitting }) => { addLabel({ name: values.name, id: task.id }); setSubmitting(false) }}>
		{({ values, handleChange, isValid, submitForm, errors, handleSubmit }) => (
			<form onSubmit={handleSubmit} className="inline">
				<input
					type="text"
					className="mr-2 text-sm border-none focus:border-none pl-2 w-14 bg-slate-50 rounded shadow"
					onChange={handleChange}
					value={values.name}
					name="name"
				/>
				{errors.name}
				{isValid ? <SecondaryButton onClick={submitForm}>Add</SecondaryButton> : undefined}
			</form>
		)}
	</Formik>)}</ProjectContext.Consumer>
}

export function Labels({ labels, children, onClick }: { children?: ReactNode, labels?: string[], onClick: (name: string) => void }) {
	return labels
		? <div className="text-left mb-2">{labels.map((label) => (
			<SecondaryButton
				key={label}
				onClick={() => onClick(label)}
			>
				{label}
			</SecondaryButton>
		))}{children}</div>
		: undefined
}

export function TaskEditing({
	task,
	close,
}: {
	close: () => void;
	task: Task;
}) {
	const [addingLabel, setAddingLabel] = useState(false);
	return (
		<div>
			<ProjectContext.Consumer>
				{({ editTask, deleteLabel }) => (
					<div>
						<Form text="Save" task={task} close={close} onSubmit={editTask}>
							<Labels labels={task.labels} onClick={(label) => deleteLabel({ id: task.id, name: label })}>
								{addingLabel ? <AddLabelForm task={task} cancel={() => setAddingLabel(false)} /> : <SecondaryButton onClick={() => setAddingLabel(true)}>+</SecondaryButton>}
							</Labels>
						</Form>
					</div>
				)}
			</ProjectContext.Consumer>
		</div>
	);
}

export default function TaskCreation() {
	const [active, setActive] = useState(false);
	if (active)
		return (
			<ProjectContext.Consumer>
				{({ createTask }) => (
					<Form
						text="Create"
						task={{
							name: "New Task",
							id: -1,
							archived: false,
							completed: false,
						}}
						close={() => setActive(false)}
						onSubmit={(task) =>
							createTask({
								name: task.name,
								description: task.description,
								labels: task.labels,
							})
						}
					/>
				)}
			</ProjectContext.Consumer>
		);
	return (
		<SecondaryListItemButton onClick={() => setActive(true)}>
			Create task
		</SecondaryListItemButton>
	);
}
