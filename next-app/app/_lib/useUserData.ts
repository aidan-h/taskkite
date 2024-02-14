import { createContext } from "react";
import {
	AppData,
	ClientEvent,
	Project,
} from "./data";
import {
	SyncClient,
} from "./sync";
import { ProjectSync } from "./projectSync";

export type ProjectClientData = SyncClient<Project> & {
	emitEvent: (event: ClientEvent) => void;
};

export type AppSync = SyncClient<AppData>;
export const AppDataContext = createContext<{
	data: AppData;
	update: () => void;
	projects: ProjectSync[],
}>({
	data: {
		email: "test@test.com",
		name: "name",
		projects: [],
	},
	projects: [],
	update: () => { },
});

