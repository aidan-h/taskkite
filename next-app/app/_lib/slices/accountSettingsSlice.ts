import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AccountSettings } from "../data";

export const accountSettingsSlice = createSlice({
  name: "accountSettings",
  initialState: {
    name: "null",
    email: "null@null",
  },
  reducers: {
    updateAccount: (_, action: PayloadAction<AccountSettings>) =>
      action.payload,
  },
});

export const { updateAccount } = accountSettingsSlice.actions;
