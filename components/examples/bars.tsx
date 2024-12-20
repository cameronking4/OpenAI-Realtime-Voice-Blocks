"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MicOff, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useWebRTCAudioSession from '@/hooks/use-webrtc'; // Replace useVapi import
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// Add interface for audio parameters
interface AudioParameters {
  waveIntensity: number;
  noiseLevel: number;
  frequency: number;
  complexity: number;
  barCount: number;
}

const AudioVisualizer: React.FC<{ 
  audioData: Uint8Array; 
  isSessionActive: boolean;
  barCount: number;
}> = ({ audioData, isSessionActive, barCount }) => {
  return (
    <motion.svg 
      width="100%" 
      height="100%" 
      viewBox="0 0 1000 200" 
      preserveAspectRatio="xMidYMid meet"
      initial={{ opacity: 0 }}
      animate={{ opacity: isSessionActive ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
    >
      {Array.from({ length: barCount }).map((_, index) => {
        const height = audioData[Math.floor(index * (audioData.length / barCount))] || 0;
        const normalizedHeight = (height / 255) * 100;
        const spacing = Math.min(1000 / (barCount * 2), 100);
        const barWidth = Math.min(spacing * 0.5, 50);
        
        return (
          <React.Fragment key={index}>
            <rect
              x={500 + index * spacing - (spacing * barCount / 2)}
              y={100 - normalizedHeight / 2}
              width={barWidth}
              height={normalizedHeight}
              className={`fill-current ${isSessionActive ? 'text-black dark:text-white opacity-70' : 'text-gray-400 opacity-30'}`}
            />
            <rect
              x={500 - index * spacing - barWidth - (spacing * barCount / 2)}
              y={100 - normalizedHeight / 2}
              width={barWidth}
              height={normalizedHeight}
              className={`fill-current ${isSessionActive ? 'text-black dark:text-white opacity-70' : 'text-gray-400 opacity-30'}`}
            />
          </React.Fragment>
        );
      })}
    </motion.svg>
  );
};

const AudioAnalyzer: React.FC<{ 
  volumeLevel: number; 
  isSessionActive: boolean;
  audioParams: AudioParameters;
}> = ({ volumeLevel, isSessionActive, audioParams }) => {
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(128));

  useEffect(() => {
    if (!isSessionActive) {
      setAudioData(new Uint8Array(128));
      return;
    }

    const updateAudioData = () => {
      const dataArray = new Uint8Array(128);
      const time = Date.now() / 1000;
      
      for (let i = 0; i < dataArray.length; i++) {
        // Adjust wave parameters based on complexity
        const waves = [];
        for (let j = 1; j <= audioParams.complexity; j++) {
          waves.push(
            Math.sin(time * j * audioParams.frequency + i * 0.1) * 
            (audioParams.waveIntensity / j)
          );
        }
        
        const combinedWave = waves.reduce((a, b) => a + b, 0) * volumeLevel;
        const noise = (Math.random() - 0.5) * audioParams.noiseLevel * volumeLevel;
        
        dataArray[i] = Math.min(Math.max(128 + (combinedWave + noise) * 128, 0), 255);
      }
      setAudioData(dataArray);
    };

    const tick = () => {
      updateAudioData();
      animationFrameId = requestAnimationFrame(tick);
    };

    let animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [volumeLevel, isSessionActive, audioParams]);

  return <AudioVisualizer 
    audioData={audioData} 
    isSessionActive={isSessionActive} 
    barCount={audioParams.barCount}
  />;
};

const MinimalComponent: React.FC<{
  audioParams: AudioParameters;
}> = ({ audioParams }) => {
  const { currentVolume: volumeLevel, isSessionActive, handleStartStopClick: toggleCall } = useWebRTCAudioSession('alloy');
  const [showVisualizer, setShowVisualizer] = useState(false);

  const handleToggleCall = () => {
    toggleCall();
    setShowVisualizer(!isSessionActive);
  };

  const micPulseAnimation = {
    scale: [1, 1.2, 1],
    opacity: [1, 0.8, 1],
    transition: { duration: 0.8, repeat: Infinity }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      <div className="flex items-center justify-center w-full">
        <motion.button
          key="callButton"
          onClick={handleToggleCall}
          className="p-2 rounded-xl bg-secondary"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          initial={{ x: 0 }}
          animate={{ 
            x: showVisualizer ? -10 : 0,
            ...((isSessionActive && volumeLevel === 0) ? micPulseAnimation : {})
          }}
          transition={{ duration: 0.3 }}
          style={{ zIndex: 10, position: 'relative' }}
        >
          {isSessionActive ? <MicOff size={20} /> : <Mic size={20} />}
        </motion.button>
        <AnimatePresence>
          {showVisualizer && (
            <motion.div
              className="rounded-4xl"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '100%', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ marginLeft: '10px' }}
            >
              <AudioAnalyzer volumeLevel={volumeLevel} isSessionActive={isSessionActive} audioParams={audioParams} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const MinimalShowcase = () => {
  const [audioParams, setAudioParams] = useState<AudioParameters>({
    waveIntensity: 0.1,
    noiseLevel: 9,
    frequency: 5,
    complexity: 5,
    barCount: 5
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-full gap-4">
      <MinimalComponent audioParams={audioParams} />
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="lg" className="mb-4">Animation Settings</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Audio Visualization</h4>
                <p className="text-sm text-muted-foreground">Adjust the wave visualization parameters.</p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="waveIntensity">Wave Intensity</Label>
                  <Input
                    id="waveIntensity"
                    type="number"
                    step={0.5}
                    value={audioParams.waveIntensity}
                    className="col-span-2"
                    onChange={(e) => setAudioParams({...audioParams, waveIntensity: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="noiseLevel">Noise Level</Label>
                  <Input
                    id="noiseLevel"
                    type="number"
                    step={1}
                    value={audioParams.noiseLevel}
                    className="col-span-2"
                    onChange={(e) => setAudioParams({...audioParams, noiseLevel: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    type="number"
                    step={1}
                    value={audioParams.frequency}
                    className="col-span-2"
                    onChange={(e) => setAudioParams({...audioParams, frequency: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="complexity">Wave Complexity</Label>
                  <Input
                    id="complexity"
                    type="number"
                    min={1}
                    max={10}
                    value={audioParams.complexity}
                    className="col-span-2"
                    onChange={(e) => setAudioParams({...audioParams, complexity: parseInt(e.target.value)})}
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="barCount">Bar Count</Label>
                  <Input
                    id="barCount"
                    type="number"
                    min={1}
                    max={50}
                    value={audioParams.barCount}
                    className="col-span-2"
                    onChange={(e) => setAudioParams({...audioParams, barCount: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default MinimalShowcase;
