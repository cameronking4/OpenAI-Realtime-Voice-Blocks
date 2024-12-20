"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  DynamicIslandProvider,
  DynamicIsland,
  DynamicContainer,
  DynamicDescription,
  DynamicDiv,
  DynamicTitle,
  useDynamicIslandSize,
  SIZE_PRESETS
} from "@/components/ui/dynamic-island"; // Adjust import paths as needed
import useWebRTCAudioSession from '@/hooks/use-webrtc'; // Replace useVapi import
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react"; // Assuming you have these icons available

const DynamicIslandExample = () => {
  const { handleStartStopClick: toggleCall, isSessionActive, currentVolume: volumeLevel, conversation } = useWebRTCAudioSession('alloy');
  const { setSize } = useDynamicIslandSize();
  const [isStartingCall, setIsStartingCall] = useState(false);
  const [isEndingCall, setIsEndingCall] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);

  useEffect(() => {
    if (isSessionActive) {
      setIsStartingCall(false);

      if (volumeLevel > 0.002) {
        setIsListening(false);
        if (timer) {
          clearTimeout(timer);
          setTimer(null);
        }
        setSize(SIZE_PRESETS.TALL);
      } else if (volumeLevel === 0 && !isListening) {
        if (!timer) {
          const newTimer = setTimeout(() => {
            setIsListening(true);
            setSize(SIZE_PRESETS.COMPACT);
          }, 1500);
          setTimer(newTimer);
        }
      }

      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    } else {
      setIsEndingCall(false);
      setIsListening(false);
      if (timer) {
        clearTimeout(timer);
        setTimer(null);
      }
      setSize(SIZE_PRESETS.DEFAULT);
    }
    if(!isSessionActive || isListening){
      setSize(SIZE_PRESETS.DEFAULT);
    }
  }, [isSessionActive, setSize, volumeLevel, timer]);

  useEffect(() => {
    if (conversation) {
      setMessages(conversation);
    }
  }, [conversation]);

  const handleDynamicIslandClick = async () => {
    if (isSessionActive) {
      setIsEndingCall(true);
      await toggleCall();
      setIsEndingCall(false);
      setSize(SIZE_PRESETS.DEFAULT);
    } else {
      setIsStartingCall(true);
      await toggleCall();
      setIsStartingCall(false);
      setSize(SIZE_PRESETS.DEFAULT);
    }
  };

  const renderState = () => {
    if (isStartingCall || isEndingCall) {
      return (
        <DynamicContainer className="flex items-center justify-center h-full w-full">
          <Loader className="animate-spin h-12 w-12 text-yellow-300" />
          <DynamicTitle className="ml-2 text-2xl font-black tracking-tighter text-white my-2 mr-3">
            {isStartingCall ? "Starting" : "Ending"}
          </DynamicTitle>
        </DynamicContainer>
      );
    }

    if (!isSessionActive) {
      return (
        <DynamicContainer className="flex items-center justify-center h-full w-full">
          <DynamicTitle className="text-2xl font-black tracking-tighter text-white my-2">Start Call</DynamicTitle>
        </DynamicContainer>
      );
    }

    if (isListening) {
      return (
        <DynamicContainer className="flex flex-col items-center justify-center h-full w-full">
          <DynamicTitle className="text-2xl font-black tracking-tighter text-white my-2">Listening...</DynamicTitle>
        </DynamicContainer>
      );
    }

    return (
      <DynamicContainer className="flex flex-col h-full w-full px-4 py-2">
        <div ref={scrollRef} className="h-full overflow-hidden">
          <DynamicDiv className="flex justify-center w-full h-full">
            <div className="size-full bg-cyan-300 rounded-2xl">
              <DynamicDescription className="w-full h-full px-3 py-2 items-center justify-center text-center text-white text-sm leading-snug tracking-tight overflow-y-auto">
                {conversation?.length > 0 && 
                  conversation
                    .filter(m => m.role === 'assistant')
                    .slice(-1)[0]?.text
                }
              </DynamicDescription>
            </div>
          </DynamicDiv>
        </div>
      </DynamicContainer>
    );
  };

  return (
    <div onClick={handleDynamicIslandClick} className="cursor-pointer">
      <DynamicIsland id="vapi-dynamic-island">
        {renderState()}
      </DynamicIsland>
    </div>
  );
};

const DynamicIslandExampleWrapper = () => {
  return (
    <DynamicIslandProvider initialSize={SIZE_PRESETS.DEFAULT}>
      <div className="h-full">
        <DynamicIslandExample />
      </div>
    </DynamicIslandProvider>
  );
};

export default DynamicIslandExampleWrapper;