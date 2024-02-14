import { useRouter } from "next/navigation";

export default function PrivacyPolicy() {
	const router = useRouter();
	return <button className="mx-auto block mt-4" onClick={() => router.push("/privacy-policy")}>Privacy Policy</button>
}

