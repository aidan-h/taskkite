"use client";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Component() {
  const { data: session } = useSession();
  const router = useRouter();
  if (session && session.user) {
    router.push("/app");
  }
  const footnote = "100% original name and idea. Please don't steal!";

  return (
    <>
      <h1>To-Do App</h1>
      <button onClick={() => signIn()}>Sign in</button>
      <p>{footnote}</p>
    </>
  );
}
