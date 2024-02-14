'use-client'
import { useAppSelector } from "./hooks";

export default function useProjects() {
	return useAppSelector((app) => app.projects);
}
