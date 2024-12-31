"use client";

import { Shine } from "@/components/examples/shine";
import Logos from "@/components/logos";
import { ArrowRight, MicIcon, PhoneOff, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import SparklesText from "@/components/ui/sparkle-text";
import { siteConfig } from "@/config/site";
import { motion } from "framer-motion";
import React, { useState, useEffect } from 'react';
import AbstractBall from '@/components/abstract-ball';
import useWebRTCAudioSession from '@/hooks/use-webrtc';
import { StatusDisplay } from "@/components/examples/status-notifications";


export default async function Page() {
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
        const res = await fetch("https://api.github.com/repos/cameronking4/openai-realtime-blocks", {
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
          <span className="mr-3">🎉</span> Welcome to the AI Component Library!{" "}
        </Link>
        <h1 className="text-balance font-urban text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px]">
          Add{"  "}
          <span className="text-gradient_indigo-purple font-extrabold">
            Voice AI
          </span> 
          {" "}into your Next Apps with
          <SparklesText text={"OpenAI Realtime Blocks"}/>
        </h1>
        <p className="text-muted-foreground">
          A library of pre-built UI components for AI to copy and paste in your Next.js apps.
        </p>
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
            href={siteConfig.links.github}
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
  return (
    <section className="relative w-full mx-auto flex flex-col justify-center items-center gap-8">
      <div className="relative flex justify-center items-center w-full p-2">
        <motion.div
          layout
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full"
        >
         
            <div className="grid grid-cols-1 gap-8 w-full">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-center items-center group relative"
              >
                <GlobComponent /> 
              </motion.div>
            </div>
          
        </motion.div>
      </div>
    </section>
  );
}



const globConfig = {
  perlinTime: 90.0,
  perlinDNoise: 0.0,
  chromaRGBr: 255,
  chromaRGBg: 255,
  chromaRGBb: 255,
  chromaRGBn: 255,
  chromaRGBm: 255,
  sphereWireframe: true,
  spherePoints: true,
  spherePsize: 0.3,
  cameraSpeedY: 0,
  cameraSpeedX: 0,
  cameraZoom: 170,
  cameraGuide: false,
  perlinMorph: 9,
};

const GlobComponent: React.FC = () => {
  const { status, currentVolume, isSessionActive, handleStartStopClick } = useWebRTCAudioSession('alloy');
  const [config, setConfig] = useState(globConfig);

  useEffect(() => {
    if (!isSessionActive) {
      setConfig(globConfig);
      return;
    }
    // Only update when volume changes and session is active
    if (isSessionActive && currentVolume > 0.01) {
      setConfig({
        ...globConfig,
        perlinTime: 20.0,
        perlinMorph: 25.0,
      });
    } else {
      setConfig({
        ...globConfig,
      });
    }
  }, [isSessionActive, currentVolume]);

  return (
    <div style={{ width: '100%', height: '100%' }} className="flex flex-col justify-center items-center cursor-pointer" onClick={handleStartStopClick}>
      <AbstractBall {...config} />
      <StatusDisplay status={status} />
    </div>
  );
};