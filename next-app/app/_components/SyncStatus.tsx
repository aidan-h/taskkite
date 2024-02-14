import { ProjectContext } from "../_lib/ProjectContext";
import { SyncStatus as Status, syncStatusText } from "../_lib/sync";
import SecondaryButton from "./SecondaryButton";

export default function SyncStatus() {
	return <div className="absolute left-0 bottom-0 m-4">
		<ProjectContext.Consumer>{({ sync, status }) => {
			if (status == Status.PENDING)
				return <div>Syncing</div>
			return <SecondaryButton onClick={sync}>{syncStatusText(status)}</SecondaryButton>
		}}</ProjectContext.Consumer>
	</div>
}
