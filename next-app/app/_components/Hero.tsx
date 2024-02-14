import { ReactNode } from "react";

export default function Hero({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto p-12 max-w-2xl bg-slate-100 shadow-lg mt-24">
      <h1 className="w-full font-serif text-center text-5xl mb-8">Taskkite</h1>
      {children}
    </div>
  );
}
