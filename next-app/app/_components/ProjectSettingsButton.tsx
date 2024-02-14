import { useRouter } from "next/navigation";

export default function ProjectSettingsButton({ id }: { id: number }) {
	const router = useRouter();
	return <button
		className="bg-slate-500 rounded-full p-6 absolute right-6 top-6"
		onClick={() => router.push("/app/project/" + id + "/settings")}
	></button>
}

