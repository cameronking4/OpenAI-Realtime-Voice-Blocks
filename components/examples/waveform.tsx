"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MicIcon, PhoneOff, Podcast } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useVapi from '@/hooks/use-vapi';

const Waveform: React.FC = () => {
  const { volumeLevel, isSessionActive, toggleCall } = useVapi();
  const [bars, setBars] = useState(Array(50).fill(0));

  useEffect(() => {
    if (isSessionActive) {
      updateBars(volumeLevel);
    } else {
      resetBars();
    }
  }, [volumeLevel, isSessionActive]);

  const updateBars = (volume: number) => {
    setBars(bars.map(() => Math.random() * volume * 50));
  };

  const resetBars = () => {
    setBars(Array(50).fill(0));
  };

  return (
    <div className='border text-center justify-items-center p-4 rounded-2xl'>
      <div className="flex items-center justify-center size-full relative p-12">
        <motion.div
          className="relative z-10"
          initial={{ scale: 1 }}
          animate={isSessionActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 0.6, repeat: Infinity }}
        >
          <Podcast
            size={28}
            className="text-black dark:text-white cursor-pointer"
            onClick={toggleCall}
          />
        </motion.div>
        {isSessionActive && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {bars.map((height, index) => {
              const angle = (index / bars.length) * 360;
              const radians = (angle * Math.PI) / 180;
              const x1 = 150 + Math.cos(radians) * 50;
              const y1 = 150 + Math.sin(radians) * 50;
              const x2 = 150 + Math.cos(radians) * (100 + height);
              const y2 = 150 + Math.sin(radians) * (100 + height);

              return (
                <motion.line
                  key={index}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className="stroke-current text-black dark:text-white dark:opacity-70 opacity-70"
                  strokeWidth="2"
                  initial={{ x2: x1, y2: y1 }}
                  animate={{ x2, y2 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
              );
            })}
          </motion.div>
        )}
      </div>
      <Button onClick={toggleCall} className='m-2'>
        {isSessionActive ? <PhoneOff size={18} /> : <MicIcon size={18} />}
      </Button>
    </div>
  );
};

export default Waveform;
