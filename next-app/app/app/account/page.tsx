'use client'
import { validateName } from "@/app/_lib/data";
import { UserData, UserDataContext } from "@/app/_lib/useUserData";
import { Formik, FormikErrors } from "formik";
import { useSession, signOut } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";

// add UpdateUserData TODO
function Account({ userData, router, fetchUserData }: { userData: UserData, fetchUserData: () => undefined, router: AppRouterInstance }) {
	return <Formik initialValues={{ name: userData.name }}
		validate={values => {
			let errors: FormikErrors<{ name: string }> = {};
			const nameError = validateName(values.name);
			if (nameError)
				errors.name = nameError
			return errors
		}}
		onSubmit={(values, { setSubmitting }) => {
			fetch("/api/user/updateSettings", { method: "POST", body: JSON.stringify(values) }).then((resp) => {
				fetchUserData()
				setSubmitting(false)
			})
		}}
	>
		{({ values, errors, handleSubmit, isSubmitting, handleChange }) => (<form onSubmit={handleSubmit}>
			<h1>Account Settings</h1>
			<h2>Name</h2>
			<input type="text" value={values.name} maxLength={20} name="name" onChange={handleChange}></input>
			<br></br>
			{errors.name}
			{(values.name != userData.name && !errors.name) ? <button type="submit" disabled={isSubmitting}>Save Changes</button> : undefined}
			<h2>Email</h2>
			<p>{userData.email}</p>
			<button onClick={() => signOut()}>Sign Out</button><br></br>
			<button onClick={() => router.push("/app")}>Back</button>
		</form>)}

	</Formik>
}

export default function AccountPage() {
	const { data: session } = useSession()
	const router = useRouter()
	if (session === null) {
		router.push("/")
	} else if (session === undefined) {
		return <p>Loading user</p>
	}

	return <UserDataContext.Consumer>
		{([userData, fetchUserData]) => { return userData ? <Account userData={userData} fetchUserData={fetchUserData} router={router}></Account> : <></> }}
	</UserDataContext.Consumer>
}
