"use client";
import { createTask } from "@/app/_lib/api";
import { descriptionSchema, nameSchema } from "@/app/_lib/data";
import { validateInputValue } from "@/app/_lib/formikHelpers";
import { Formik, FormikErrors } from "formik";
import { useContext, useState } from "react";
import { AppDataContext } from "../_lib/useUserData";

function Form({ id, close }: { id: number; close: () => void }) {
  const [, update] = useContext(AppDataContext);
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
        createTask(id, values.name, values.description)
          .then(() => {
            update();
            close();
          }, console.error)
          .finally(() => setSubmitting(false));
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

export default function TaskCreation({ id }: { id: number }) {
  const [active, setActive] = useState(false);
  if (active) return <Form id={id} close={() => setActive(false)} />;
  return <button onClick={() => setActive(true)}>Create task</button>;
}
