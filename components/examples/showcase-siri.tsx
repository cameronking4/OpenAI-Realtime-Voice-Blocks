import React from "react";
import useVapi from "@/hooks/use-vapi"; // Adjust the import path as needed
import Transcriber from "@/components/examples/transcriber"; // Adjust the import path as needed
import Siri from "./siri";

function Hero() {
  return (
    <section className="relative w-full mx-auto flex flex-col justify-center items-center gap-8">
      <div className="flex flex-col gap-5 text-center animate-hero-in">
        <span className="text-4xl mt-8 max-w-3xl font-medium tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text">
          Two theme options
        </span>
         <h1>{`"iOS"`}</h1>
         <Siri theme="ios"/>
         <br/>
         <h1>{`"iOS9"`}</h1>
         <Siri theme="ios9"/>
        </div>
    </section>
  );
}

export default Hero;
