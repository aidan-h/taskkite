import { useRouter } from "next/navigation";

export default function ProjectSettingsButton({ id }: { id: number }) {
	const router = useRouter();
	return (
		<button
			className="bg-slate-500 rounded text-slate-50 px-4 py-1"
			onClick={() => router.push("/app/project/" + id + "/settings")}
		>Project Settings</button>
	);
}
