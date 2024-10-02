import React from "react";

export function ShineCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative size-80 overflow-hidden flex flex-col items-center gap-2 justify-center border rounded-[1rem] p-2">
      {children}
      <div className="absolute inset-0 flex w-full h-full justify-center items-center z-10 [transform:translateX(-130%)_skew(25deg)] duration-1000 group-hover:duration-1000 group-hover:[transform:translateX(130%)_skew(15deg)]">
        <div className="w-20 h-full bg-white/40 blur-[80px]"></div>
      </div>
    </div>
  );
}

export default function ShineCardExample() {
  return (
    <ShineCard>
      <span className="text-sm font-semibold">Hover me 👀</span>
    </ShineCard>
  );
}
