"use client";

import React, { useState, useEffect } from 'react';
import { Mic, PhoneCall } from 'lucide-react';
import ReactSiriwave, { IReactSiriwaveProps } from 'react-siriwave';
import { motion, AnimatePresence } from 'framer-motion';
import useVapi from '@/hooks/use-vapi'; // Adjust the import path as needed
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Define CurveStyle type
type CurveStyle = "ios" | "ios9";

interface SiriProps {
  theme: CurveStyle;
}

const Siri: React.FC<SiriProps> = ({ theme }) => {
  const { volumeLevel, isSessionActive, toggleCall } = useVapi();
  const [siriWaveConfig, setSiriWaveConfig] = useState<IReactSiriwaveProps>({
    theme: theme || "ios9",
    ratio: 1,
    speed: 0.2,
    amplitude: 1,
    frequency: 6,
    color: '#9E9E9E',
    cover: true,
    width: 300,
    height: 100,
    autostart: true,
    pixelDepth: 1,
    lerpSpeed: 0.1,
  });

  useEffect(() => {
    setSiriWaveConfig(prevConfig => ({
      ...prevConfig,
      amplitude: isSessionActive ? (volumeLevel > 0.01 ? volumeLevel * 7.5 : 0) : 0,
      speed: isSessionActive ? (volumeLevel > 0.5 ? volumeLevel * 10 : 0) : 0,
      frequency: isSessionActive ? (volumeLevel > 0.01 ? volumeLevel * 5 : 0) : (volumeLevel > 0.5 ? volumeLevel * 10 : 0),
    }));
  }, [volumeLevel, isSessionActive]);

  const handleToggleCall = () => {
    toggleCall();
  };

  const handleConfigChange = (key: keyof IReactSiriwaveProps, value: any) => {
    setSiriWaveConfig(prevConfig => ({
      ...prevConfig,
      [key]: value,
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      <div className="flex items-center justify-center">
        <motion.button
          key="callButton"
          onClick={handleToggleCall}
          className="p-2 rounded-xl bg-secondary"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          initial={{ x: 0 }}
          animate={{ x: isSessionActive ? -10 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ zIndex: 10, position: 'relative' }}
        >
          <AnimatePresence>
            {!isSessionActive ? (
              <motion.div
                key="micIcon"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Mic size={20} />
              </motion.div>
            ) : (
              <PhoneCall size={20} />
            )}
          </AnimatePresence>
        </motion.button>
        <motion.div
          className="rounded-4xl p-4 overflow-hidden"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '100%', opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ marginLeft: '10px' }}
        >
          <ReactSiriwave {...siriWaveConfig} />
        </motion.div>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="mt-4">Configure Siriwave</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Siriwave Configuration</h4>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="theme">Theme</Label>
                <Input
                  id="theme"
                  defaultValue={siriWaveConfig.theme}
                  className="col-span-2 h-8"
                  onChange={e => handleConfigChange('theme', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="speed">Speed</Label>
                <Input
                  id="speed"
                  type="number"
                  defaultValue={siriWaveConfig.speed}
                  className="col-span-2 h-8"
                  onChange={e => handleConfigChange('speed', parseFloat(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="amplitude">Amplitude</Label>
                <Input
                  id="amplitude"
                  type="number"
                  defaultValue={siriWaveConfig.amplitude}
                  className="col-span-2 h-8"
                  onChange={e => handleConfigChange('amplitude', parseFloat(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="frequency">Frequency</Label>
                <Input
                  id="frequency"
                  type="number"
                  defaultValue={siriWaveConfig.frequency}
                  className="col-span-2 h-8"
                  onChange={e => handleConfigChange('frequency', parseFloat(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  type="text"
                  defaultValue={siriWaveConfig.color}
                  className="col-span-2 h-8"
                  onChange={e => handleConfigChange('color', e.target.value)}
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Siri;
