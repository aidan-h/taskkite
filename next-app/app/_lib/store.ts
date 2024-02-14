import { configureStore } from "@reduxjs/toolkit";
import { AppData } from "./data";
import { projectsSlice } from "./slices/projectsSlice";
import { accountSettingsSlice } from "./slices/accountSettingsSlice";

export function createStore(appData: AppData) {
	return configureStore({
		reducer: {
			accountSettings: accountSettingsSlice.reducer,
			projects: projectsSlice.reducer
		},
		preloadedState: {
			accountSettings: {
				email: appData.email,
				name: appData.name
			},
			projects: appData.projects.map((project) => {
				return {
					name: project.name,
					id: project.id,
					owner: project.owner,
					data: undefined
				}
			})
		}
	})
}
export type AppStore = ReturnType<typeof createStore>
export type RootState = ReturnType<AppStore['getState']>

export type AppDispatch = AppStore['dispatch']
