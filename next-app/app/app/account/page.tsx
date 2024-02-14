"use client";
import { CenterContainer } from "@/app/_components/CenterContainer";
import Title from "@/app/_components/Title";
import {
	ListItem,
	ListItemButton,
	DeleteListItem,
} from "@/app/_components/listItems";
import { deleteAccount, editUser } from "@/app/_lib/api";
import { nameSchema } from "@/app/_lib/schemas";
import { useAppSelector } from "@/app/_lib/hooks";
import { updateAccount } from "@/app/_lib/slices/accountSettingsSlice";
import { Formik, FormikErrors } from "formik";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

function Account() {
	const accountSettings = useAppSelector((app) => app.accountSettings);
	const router = useRouter();
	const dispatch = useDispatch();
	return (
		<CenterContainer>
			<Formik
				initialValues={{ name: accountSettings.name }}
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
					editUser({ name: values.name })
						.then((_resp) => {
							dispatch(
								updateAccount({
									name: values.name,
									email: accountSettings.email,
								}),
							);
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
								className="w-full dark:text-zinc-900 px-2 rounded shadow text-left"
								type="text"
								value={values.name}
								maxLength={20}
								name="name"
								onChange={handleChange}
							></input>
							{errors.name}
							{values.name != accountSettings.name && !errors.name ? (
								<button type="submit" disabled={isSubmitting}>
									Save Changes
								</button>
							) : undefined}
						</ListItem>
						<ListItem>
							<p className="text-left">{accountSettings.email}</p>{" "}
						</ListItem>
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
	return <Account></Account>;
}
