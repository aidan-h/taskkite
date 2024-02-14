import { ReactNode } from "react";

export default function Descriptor({ children }: { children: ReactNode }) {
  return <p className="my-12 w-full text-center block">{children}</p>;
}
