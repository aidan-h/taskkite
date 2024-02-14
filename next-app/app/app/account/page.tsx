"use client";
import { CenterContainer } from "@/app/_components/CenterContainer";
import Title from "@/app/_components/Title";
import {
	ListItem,
	ListItemButton,
	DeleteListItem,
} from "@/app/_components/listItems";
import { deleteAccount } from "@/app/_lib/api";
import { AppData, nameSchema } from "@/app/_lib/data";
import { AppDataContext } from "@/app/_lib/useUserData";
import { Formik, FormikErrors } from "formik";
import { useSession, signOut } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";

function Account({
	appData,
	router,
	fetchUserData,
}: {
	appData: AppData;
	fetchUserData: () => void;
	router: AppRouterInstance;
}) {
	return (
		<CenterContainer>
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
						<Title>Account Settings</Title>
						<ListItem>
							<h2 className="text-left mb-2">Name</h2>
							<input
								className="w-full px-2 rounded shadow text-left"
								type="text"
								value={values.name}
								maxLength={20}
								name="name"
								onChange={handleChange}
							></input>
							{errors.name}
							{values.name != appData.name && !errors.name ? (
								<button type="submit" disabled={isSubmitting}>
									Save Changes
								</button>
							) : undefined}
						</ListItem>
						<ListItem>
							<p className="text-left">{appData.email}</p>						</ListItem>
					</form>
				)}
			</Formik>
			<ListItemButton onClick={() => signOut()}>Sign Out</ListItemButton>
			<ListItemButton onClick={() => router.push("/app")}>Back</ListItemButton>
			<DeleteListItem
				action={deleteAccount}
				text="Delete Account"
				confirmText="Are you sure you want to delete you account? This cannot be undone!"
			/>
		</CenterContainer>
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
