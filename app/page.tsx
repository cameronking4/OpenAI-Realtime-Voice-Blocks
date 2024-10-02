"use client";
import { Icons } from "@/components/icons";
import { Shine } from "@/components/examples/shine";
import Glob  from "@/components/examples/glob";
import Logos from "@/components/logos";
import { ArrowRight, ArrowRightIcon, MicIcon, PhoneOff, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import SparklesText from "@/components/ui/sparkle-text";
import Siri from "@/components/examples/siri";
import React, { useEffect, useState } from "react";
import useVapi from "@/hooks/use-vapi"; // Adjust the import path as needed
import Transcriber from "@/components/examples/transcriber"; // Adjust the import path as needed


export default async function Home() {
  return (
    
    <div className="flex flex-col gap-4 container justify-center items-center">
      <Shine>
      <HeroLanding />
      </Shine>
      <Hero/>
      <Logos />
      <hr/>
    </div>
  );
}

function HeroLanding() {
  const [stars, setStars] = useState(null);

  useEffect(() => {
    const getRepoStars = async () => {
      try {
        const res = await fetch("https://api.github.com/repos/cameronking4/VapiBlocks", {
          cache: "no-store",
        });
        const data = await res.json();
        setStars(data.stargazers_count);
      } catch (error) {
        console.error("Failed to fetch repo stars:", error);
      }
    };

    getRepoStars();
  }, []);

  return (
    <section className="space-y-6 pb-12 pt-16 lg:py-18">
      <div className="container flex max-w-[64rem] flex-col items-center gap-5 text-center">
        <Link
          href="https://github.com/cameronking4"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "animate-fade-up opacity-0")}
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
          target="_blank"
        >
          <span className="mr-3">🎉</span> Welcome to the Future of DriveThru!{" "}
        </Link>
        <h1 className="text-balance font-urban text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px]">
          Effortlessly add {" "}
          <span className="text-gradient_indigo-purple font-extrabold">
            Voice AI {""}
          </span> 
          into your Web Apps with
          {/* {" "}
          <span className="text-gradient_indigo-purple font-extrabold">
            Web Apps{" "}
          </span>with{" "} */}
          <SparklesText text={"pre-built UI Components"}/>
        </h1>
        <div
          className="flex justify-center space-x-2 md:space-x-4 mt-2"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <Link
            href="/docs/changelog"
            prefetch={true}
            className={cn(buttonVariants({ size: "lg"}), "gap-2")}
          >
            <span>Browse Components</span>
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="https://github.com/cameronking4/VapiBlocks"
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-5 space-x-2")}
          >
            <Star className="size-4" />
            {stars !== null && (
              <span className="group-hover:text-yellow-400 transition-all duration-300 ease-in-out mr-2">
                {stars}{" "} {stars !== null && (stars === 1 ? "star " : "stars ")}{" "} on GitHub
              </span>
            )}
          </Link>
        </div>
      </div>
    </section>
  );
}

function Hero() {
  const { toggleCall, isSessionActive, volumeLevel, conversation } = useVapi();
  return (
    <section className="relative w-full mx-auto flex flex-col justify-center items-center gap-8">
      <div className="flex flex-col gap-5 text-center animate-hero-in">
        <a
          rel="noopener noreferrer"
        >
          <button
            onClick={toggleCall}
            className="inline-flex items-center space-x-2 p-4 justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary shadow hover:bg-indigo/30 hover:text-indigo"
          >
           {isSessionActive ? <PhoneOff/> : <MicIcon/>}
          </button>
          <p className="text-sm mt-4 animate" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>Talk to Vapi Blocks</p>
        </a>
      </div>
      <div className="relative flex justify-center items-center aspect-video w-full p-2">
        <span className="absolute top-75 w-[calc(100%-70%)] h-[calc(100%-70%)] bg-purple-700 blur-[120px]"></span>
        <div className="size-full mx-auto">
          <Transcriber conversation={conversation} />
        </div>
      </div>
    </section>
  );
}