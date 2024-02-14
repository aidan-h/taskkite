"use client";
import { useRouter } from "next/navigation";
import { AppDataContext } from "../_lib/useUserData";
import { useContext } from "react";

export default function AccountButton() {
	const router = useRouter();
	const { data } = useContext(AppDataContext);
	return (
		<button
			className="relative text-left bg-stone-400 text-slate-50 rounded-full p-5 m-2 sm:m-4"
			onClick={() => router.push("/app/account")}
		>
			<div className="absolute top-1 text-xl left-0 text-center w-full my-auto">
				{data.name[0].toUpperCase()}
			</div>


		</button>
	)
}
