import { ReactNode } from "react";

export function CenterContainer({ children }: { children: ReactNode }) {
  return <div className="max-w-lg mt-24 mx-auto">{children}</div>;
}
