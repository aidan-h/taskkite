import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AccountSettings } from "../schemas";

export const accountSettingsSlice = createSlice({
	name: "accountSettings",
	initialState: {
		name: "null",
		email: "null@null",
	} as AccountSettings,
	reducers: {
		updateAccount: (_, action: PayloadAction<AccountSettings>) =>
			action.payload,
	},
});

export const { updateAccount } = accountSettingsSlice.actions;
