"use client";
import { useRouter } from "next/navigation";
import { AppDataContext } from "../_lib/useUserData";

export default function AccountButton() {
	const router = useRouter();
	return (
		<AppDataContext.Consumer>
			{({ data }) =>
				<button
					className="relative text-left bg-slate-50 text-slate-500 rounded-full p-5 m-2 sm:m-4"
					onClick={() => router.push("/app/account")}
				>
					<div className="absolute top-1.5 text-xl left-0 text-center w-full my-auto">
						{data.name[0].toUpperCase()}
					</div>


				</button>
			}</AppDataContext.Consumer>
	)
}
