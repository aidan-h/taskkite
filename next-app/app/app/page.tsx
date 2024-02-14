"use client";
import { Formik, FormikErrors } from "formik";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { nameSchema } from "../_lib/data";
import { fromZodError } from "zod-validation-error";
import { stringify } from "querystring";
import { AppDataContext } from "../_lib/useUserData";
import { Project, createProject } from "../_lib/api";

function ProjectItem({ project }: { project: Project }) {
  const router = useRouter();
  return (
    <div>
      <button onClick={() => router.push("/app/project/" + project.id)}>
        {project.name}
      </button>
    </div>
  );
}

function ProjectList() {
  const [userData] = useContext(AppDataContext);
  return (
    <>
      {userData.data.projects.map((project) => (
        <ProjectItem key={project.id} project={project} />
      ))}
    </>
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
  const [, updateUserData] = useContext(AppDataContext);

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
            updateUserData();
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
          <form onSubmit={handleSubmit}>
            {err}
            <button onClick={() => setCreateProject(false)}>Cancel</button>
            <br />
            <input
              name="name"
              type="text"
              value={values.name}
              onChange={handleChange}
            />
            <br />
            {errors.name}
            {isSubmitting ? <p>Submitting form</p> : undefined}
            <br />
            <button type="submit" disabled={isSubmitting}>
              Create
            </button>
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
      <button onClick={() => setCreateProject(true)}>Create Project</button>
    );
  return <CreateProjectForm setCreateProject={setCreateProject} />;
}

export default function Home() {
  const router = useRouter();

  return (
    <>
      <ProjectList></ProjectList>
      <CreateProjectButton></CreateProjectButton>
      <br />
      <button onClick={() => router.push("/app/account")}>Account</button>
    </>
  );
}
