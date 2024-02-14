import { Task, descriptionSchema, nameSchema } from "../_lib/schemas";
import { Field, Form, FormikErrors, FormikProps, withFormik } from "formik";
import { validateInputValue } from "../_lib/formikHelpers";
import SubmitCancel from "./SubmitCancel";
import SecondaryButton from "./SecondaryButton";
import { createContext, useContext } from "react";

interface FormValues {
	task: Task,
	labelInputting: string
}

export const TaskFormContext = createContext(() => { });

function InnerForm({ errors, handleChange, setValues, values }: FormikProps<FormValues>) {
	const cancel = useContext(TaskFormContext);
	return <div className="shadow-lg bg-zinc-50 dark:bg-zinc-700 mb-4 relative rounded p-6">
		<Form>
			<div className="text-left mb-2">
				{values.task.labels.map((label) => (
					<SecondaryButton key={label} onClick={() => setValues({
						...values,
						task: {
							...values.task,
							labels: values.task.labels.filter((l) => l != label),
						}
					})}>
						{label}
					</SecondaryButton>
				))}
				<Field
					className="mr-2 text-sm border-none focus:border-none pl-2 w-14 bg-zinc-50 dark:bg-zinc-600 rounded shadow"
					name="labelInputting"
				/>
				{values.labelInputting != "" ? errors.labelInputting ? <div>{errors.labelInputting}</div> :
					<SecondaryButton onClick={() => setValues({
						labelInputting: "",
						task: {
							...values.task,
							labels: [...values.task.labels, values.labelInputting]
						}
					})}>Add</SecondaryButton> : undefined}
			</div>

			< Field
				autoFocus={true}
				className="mb-4 py-1 pl-2 w-full bg-zinc-50 dark:bg-zinc-600 rounded shadow"
				name="task.name"
			/>
			<br />
			{errors.task?.name}
			<Field
				type="date"
				name="task.dueDate"
				className="mr-2 px-1 rounded dark:bg-zinc-600"
			/>
			<Field
				type="time"
				step={2}
				name="task.dueTime"
				className="mb-4 px-1 rounded dark:bg-zinc-600"
			/>
			<textarea
				className="w-full pl-2 mb-10 bg-zinc-50 dark:bg-zinc-600 rounded shadow"
				onChange={handleChange}
				value={values.task.description}
				name="task.description"
			/>
			{errors.task?.description}
			<br />
			<SubmitCancel
				cancel={cancel}
				submitText="Save"
			/>
		</Form >
	</div >

}

export interface FormProps {
	task: Task,
	onSubmit: (task: Task) => void,
}

const TaskForm = withFormik<FormProps, FormValues>({
	validate: (values) => {
		let errors: FormikErrors<FormValues> = {
		};
		const name = validateInputValue(nameSchema, values.task.name)
		const description = validateInputValue(descriptionSchema, values.task.description)
		if (name || description)
			errors.task = { name, description }
		if (values.labelInputting != "") {
			if (values.task.labels.find((l) => l == values.labelInputting) === undefined) {
				errors.labelInputting = validateInputValue(nameSchema, values.labelInputting)
			} else {
				errors.labelInputting = "duplicate label"
			}
		}
		console.log(errors);
		return errors;
	},
	handleSubmit: (values, { setSubmitting, props }) => {
		props.onSubmit(values.task);
		setSubmitting(false);
	},
	mapPropsToValues: props => {
		return { task: props.task, labelInputting: "" }
	}
})(InnerForm);
export default TaskForm
