import React from "react";

export function Shine({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-full flex justify-center items-center overflow-hidden">
      {children}
      <div className="z-10 absolute w-5 md:w-8 h-[calc(70%)] md:h-[calc(90%)] top-[calc(-10%)] bg-white/40 blur-2xl animate-shine"></div>
    </div>
  );
}

export default function ShineExample() {
  return (
    <Shine>
      <section className="pt-24 text-center">
        <span className="text-2xl font-bold tracking-tighter px-24 sm:text-3xl md:text-4xl lg:text-5xl/none text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-100">
          This is Voice AI
        </span>
      </section>
    </Shine>
  );
}
