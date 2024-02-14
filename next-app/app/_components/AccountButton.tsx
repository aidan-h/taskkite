import { useRouter } from "next/navigation";

export default function AccountButton() {
	const router = useRouter();
	return <button
		className="bg-slate-500 rounded-full p-6 absolute left-6 top-6"
		onClick={() => router.push("/app/account")}
	></button>
}

