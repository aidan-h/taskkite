
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const projectCountSlice = createSlice({
	name: "accountSettings",
	initialState: 0,
	reducers: {
		updateProjectCount: (_, action: PayloadAction<number>) =>
			action.payload,
	},
});

export const { updateProjectCount } = projectCountSlice.actions;
