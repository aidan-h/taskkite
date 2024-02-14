import { configureStore } from "@reduxjs/toolkit";
import { AppData, Project, ProjectEvents } from "./schemas";
import { projectsSlice } from "./slices/projectsSlice";
import { accountSettingsSlice } from "./slices/accountSettingsSlice";
import { SyncData, SyncState, createSyncData } from "./sync";

export function createStore(appData: AppData) {
	return configureStore({
		reducer: {
			accountSettings: accountSettingsSlice.reducer,
			projects: projectsSlice.reducer,
		},
		preloadedState: {
			accountSettings: {
				email: appData.email,
				name: appData.name,
			},
			projects: appData.projects.data.map<SyncData<Project, ProjectEvents>>((data) => {
				return createSyncData({
					client: {
						data: {
							id: data.id,
							owner: data.owner,
							name: data.name,
							tasks: data.tasks,
							taskCount: data.taskCount,
						},
						historyCount: data.historyCount,
					},
					shadow: {
						data: {
							id: data.id,
							owner: data.owner,
							name: data.name,
							tasks: data.tasks,
							taskCount: data.taskCount,
						},
						historyCount: data.historyCount,
					},
					syncState: SyncState.SYNCED,
				})
			})
		},
	});
}
export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore["getState"]>;

export type AppDispatch = AppStore["dispatch"];
