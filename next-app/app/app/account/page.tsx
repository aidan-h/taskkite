"use client";
import { deleteAccount } from "@/app/_lib/api";
import { AppData, nameSchema } from "@/app/_lib/data";
import { AppDataContext } from "@/app/_lib/useUserData";
import { Formik, FormikErrors } from "formik";
import { useSession, signOut } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Account({
  appData,
  router,
  fetchUserData,
}: {
  appData: AppData;
  fetchUserData: () => void;
  router: AppRouterInstance;
}) {
  const [deleteUser, setDeleteUser] = useState(false);

  return (
    <>
      <Formik
        initialValues={{ name: appData.name }}
        validate={(values) => {
          let errors: FormikErrors<{ name: string }> = {};
          try {
            nameSchema.parse(values.name);
          } catch (err) {
            errors.name = JSON.stringify(err);
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          fetch("/api/user/edit", {
            method: "POST",
            body: JSON.stringify(values.name),
          })
            .then((_resp) => {
              fetchUserData();
              setSubmitting(false);
            })
            .catch((err) => console.error(err));
        }}
      >
        {({ values, errors, handleSubmit, isSubmitting, handleChange }) => (
          <form onSubmit={handleSubmit}>
            <h1>Account Settings</h1>
            <h2>Name</h2>
            <input
              type="text"
              value={values.name}
              maxLength={20}
              name="name"
              onChange={handleChange}
            ></input>
            <br></br>
            {errors.name}
            {values.name != appData.name && !errors.name ? (
              <button type="submit" disabled={isSubmitting}>
                Save Changes
              </button>
            ) : undefined}
            <h2>Email</h2>
            <p>{appData.email}</p>
          </form>
        )}
      </Formik>
      <button onClick={() => signOut()}>Sign Out</button>
      <br></br>
      <button onClick={() => router.push("/app")}>Back</button>
      <button onClick={() => setDeleteUser(true)}>Delete Account</button>
      {deleteUser ? (
        <DeleteUserConfirmation
          close={() => setDeleteUser(false)}
          confirm={deleteAccount}
        ></DeleteUserConfirmation>
      ) : undefined}
    </>
  );
}

function DeleteUserConfirmation({
  close,
  confirm,
}: {
  close: () => void;
  confirm: () => void;
}) {
  return (
    <div>
      <h1>Are you sure you want to delete your account?</h1>
      <button onClick={close}>Cancel</button>
      <br></br>
      <button
        onClick={() => {
          confirm();
          close();
        }}
      >
        Delete
      </button>
    </div>
  );
}

export default function AccountPage() {
  const { data: session } = useSession();
  const router = useRouter();
  if (session === null) {
    router.push("/");
  } else if (session === undefined) {
    return <p>Loading user</p>;
  }

  return (
    <AppDataContext.Consumer>
      {(appData) => (
        <Account
          appData={appData.data}
          fetchUserData={appData.update}
          router={router}
        ></Account>
      )}
    </AppDataContext.Consumer>
  );
}
