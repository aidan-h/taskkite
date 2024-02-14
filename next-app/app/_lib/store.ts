import { configureStore } from "@reduxjs/toolkit";
import { AppData } from "./data";
import { ClientProject, SyncState, newProjectsSlice } from "./slices/projectsSlice";
import { accountSettingsSlice } from "./slices/accountSettingsSlice";

export function createStore(appData: AppData) {
	return configureStore({
		reducer: {
			accountSettings: accountSettingsSlice.reducer,
			projects: newProjectsSlice.reducer,
		},
		preloadedState: {
			accountSettings: {
				email: appData.email,
				name: appData.name,
			},
			projects: {
				projects: appData.projects.data.map((data) => {
					return {
						client: {
							name: data.name,
							tasks: data.tasks,
							taskCount: data.taskCount,
							historyCount: data.historyCount,
						},
						shadow: {
							name: data.name,
							tasks: data.tasks,
							taskCount: data.taskCount,
							historyCount: data.historyCount,
						},
						syncState: SyncState.SYNCED,
					} as ClientProject
				}),
				projectCount: appData.projects.count,
			},
		},
	});
}
export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore["getState"]>;

export type AppDispatch = AppStore["dispatch"];
