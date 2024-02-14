"use client";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../_lib/hooks";

export default function AccountButton() {
  const router = useRouter();
  const name = useAppSelector((data) => data.accountSettings.name);
  return (
    <button
      className="relative text-left bg-stone-400 text-slate-50 rounded-full p-5 m-2 sm:m-4"
      onClick={() => router.push("/app/account")}
    >
      <div className="absolute top-1 text-xl left-0 text-center w-full my-auto">
        {name[0].toUpperCase()}
      </div>
    </button>
  );
}
