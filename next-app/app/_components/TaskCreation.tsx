"use client";
import {
	AddLabelEvent,
	DeleteLabelEvent,
	Task,
	descriptionSchema,
	nameSchema,
} from "@/app/_lib/schemas";
import { validateInputValue } from "@/app/_lib/formikHelpers";
import { Formik, FormikErrors } from "formik";
import { ReactNode, useState } from "react";
import { SecondaryListItemButton } from "./listItems";
import SubmitCancel from "./SubmitCancel";
import SecondaryButton from "./SecondaryButton";
import { useDispatch } from "react-redux";
import {
	addLabel,
	createTask,
	deleteLabel,
	editTask,
} from "../_lib/slices/projectsSlice";

function nullEmptyString(input?: string): string | undefined {
	if (input == "") return undefined;
	if (input) return input;
	return undefined;
}

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
	children?: ReactNode;
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
					dueDate: nullEmptyString(values.dueDate),
					archived: task.archived,
					completed: task.completed,
					labels: task.labels,
					name: values.name,
					dueTime: nullEmptyString(values.dueTime),
					description: values.description,
				});
				close();
				setSubmitting(false);
			}}
			initialValues={{
				name: task.name,
				dueDate: task.dueDate,
				dueTime: task.dueTime,
				description: task.description,
			}}
		>
			{({ handleSubmit, submitForm, handleChange, values, errors }) => (
				<div className="shadow-lg bg-zinc-50 dark:bg-zinc-700 mb-4 relative rounded p-6">
					{children}
					<form onSubmit={handleSubmit}>
						<input
							autoFocus={true}
							type="text"
							className="mb-4 py-1 pl-2 w-full bg-zinc-50 dark:bg-zinc-600 rounded shadow"
							onChange={handleChange}
							value={values.name}
							name="name"
						/>
						<br />
						{errors.name}
						<input
							type="date"
							value={values.dueDate}
							onChange={handleChange}
							name="dueDate"
							className="mr-2 px-1 rounded dark:bg-zinc-600"
						/>
						<input
							type="time"
							step={2}
							value={values.dueTime}
							onChange={handleChange}
							name="dueTime"
							className="mb-4 px-1 rounded dark:bg-zinc-600"
						/>
						<textarea
							className="w-full pl-2 mb-10 bg-zinc-50 dark:bg-zinc-600 rounded shadow"
							onChange={handleChange}
							value={values.description}
							name="description"
						/>
						{errors.description}
						<br />
						<SubmitCancel
							submit={submitForm}
							cancel={close}
							submitText={text}
						/>
					</form>
				</div>
			)}
		</Formik>
	);
}
export type AddLabel = (e: AddLabelEvent) => void;
export type DeleteLabel = (e: DeleteLabelEvent) => void;

export function AddLabelForm({
	task,
	projectId,
}: {
	task: Task;
	projectId: number;
}) {
	const dispatch = useDispatch();
	return (
		<Formik
			initialValues={{ name: "" }}
			validate={(values) => {
				let errors: FormikErrors<{ name: string }> = {};
				if (
					task.labels &&
					task.labels.find((label) => label == values.name) != undefined
				)
					errors.name = "duplicate label";
				validateInputValue(nameSchema, values.name, errors, "name");
				return errors;
			}}
			onSubmit={(values, { resetForm, setSubmitting }) => {
				dispatch(
					addLabel({ projectId: projectId, name: values.name, id: task.id }),
				);
				setSubmitting(false);
				resetForm();
			}}
		>
			{({
				values,
				handleChange,
				isValid,
				submitForm,
				errors,
				handleSubmit,
			}) => (
				<form onSubmit={handleSubmit} className="inline">
					<input
						type="text"
						className="mr-2 text-sm border-none focus:border-none pl-2 w-14 bg-zinc-50 dark:bg-zinc-600 rounded shadow"
						onChange={handleChange}
						value={values.name}
						name="name"
						autoFocus={true}
					/>
					{errors.name}
					{isValid ? (
						<SecondaryButton onClick={submitForm}>Add</SecondaryButton>
					) : undefined}
				</form>
			)}
		</Formik>
	);
}

export function Labels({
	labels,
	children,
	onClick,
}: {
	children?: ReactNode;
	labels?: string[];
	onClick: (name: string) => void;
}) {
	return labels ? (
		<div className="text-left mb-2">
			{labels.map((label) => (
				<SecondaryButton key={label} onClick={() => onClick(label)}>
					{label}
				</SecondaryButton>
			))}
			{children}
		</div>
	) : undefined;
}

export function TaskEditing({
	task,
	close,
	projectId,
}: {
	close: () => void;
	task: Task;
	projectId: number;
}) {
	const [addingLabel, setAddingLabel] = useState(false);
	const dispatch = useDispatch();
	return (
		<div>
			<div>
				<Form
					text="Save"
					task={task}
					close={close}
					onSubmit={(data) =>
						dispatch(editTask({ ...data, projectId: projectId }))
					}
				>
					<Labels
						labels={task.labels}
						onClick={(label) =>
							dispatch(
								deleteLabel({ id: task.id, name: label, projectId: projectId }),
							)
						}
					>
						{addingLabel ? (
							<AddLabelForm projectId={projectId} task={task} />
						) : (
							<SecondaryButton onClick={() => setAddingLabel(true)}>
								+
							</SecondaryButton>
						)}
					</Labels>
				</Form>
			</div>
		</div>
	);
}

export default function TaskCreation({ projectId }: { projectId: number }) {
	const [active, setActive] = useState(false);
	const dispatch = useDispatch();
	if (active)
		return (
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
					dispatch(
						createTask({
							projectId: projectId,
							name: task.name,
							description: task.description,
							labels: task.labels,
							dueTime: task.dueTime,
							dueDate: task.dueDate,
						}),
					)
				}
			/>
		);
	return (
		<SecondaryListItemButton onClick={() => setActive(true)}>
			Create task
		</SecondaryListItemButton>
	);
}
