import { ReactNode } from "react";

export default function Title({ children }: { children: ReactNode }) {
  return <h1 className="text-5xl font-bold mb-6 text-center">{children}</h1>;
}
