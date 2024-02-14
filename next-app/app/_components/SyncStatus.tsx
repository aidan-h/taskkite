"use client";
import { SyncStatus as Status, syncStatusText } from "../_lib/sync";
import SecondaryButton from "./SecondaryButton";

export default function SyncStatus({
  sync,
  status,
}: {
  sync: () => void;
  status: Status;
}) {
  if (status == Status.PENDING)
    return (
      <div className="absolute left-0 bottom-0 m-4">
        <div>Syncing</div>
      </div>
    );
  return (
    <div className="absolute left-0 bottom-0 m-4">
      <SecondaryButton onClick={sync}>{syncStatusText(status)}</SecondaryButton>
    </div>
  );
}
