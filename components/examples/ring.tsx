import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useWebRTCAudioSession from '@/hooks/use-webrtc';
import { Button } from '@/components/ui/button';
import { MicIcon, PhoneOff } from 'lucide-react';

const Visualizer: React.FC = () => {
  const { currentVolume, isSessionActive, handleStartStopClick } = useWebRTCAudioSession('alloy');

  const [waveData, setWaveData] = useState(Array(100).fill(0));

  useEffect(() => {
    if (isSessionActive) {
      updateWave(currentVolume);
    } else {
      resetWave();
    }
  }, [currentVolume, isSessionActive]);

  const updateWave = (volume: number) => {
    setWaveData(
      waveData.map(() => Math.sin(Math.random() * Math.PI * 2) * volume * 30 + 30)
    );
  };

  const resetWave = () => {
    setWaveData(Array(100).fill(30));
  };

  const generateGradient = () => {
    const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
    return (
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6ea8fe" />
          <stop offset="100%" stopColor="#1a73e8" />
        </radialGradient>
      </defs>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6">
      <AnimatePresence>
        {isSessionActive && (
          <motion.div
            className="relative w-64 h-64 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <motion.svg
              width="100%"
              height="100%"
              viewBox="0 0 200 200"
              animate={{ rotate: 360 }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {generateGradient()}
              <circle cx="100" cy="100" r="50" fill="url(#gradient)" />
              {waveData.map((radius, index) => {
                const angle = (index / waveData.length) * 360;
                const radians = (angle * Math.PI) / 180;
                const x = 100 + Math.cos(radians) * radius;
                const y = 100 + Math.sin(radians) * radius;

                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="1"
                    fill="#ffffff"
                    opacity="0.8"
                  />
                );
              })}
            </motion.svg>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div className="mt-4">
        <Button
          onClick={handleStartStopClick}
          className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg"
        >
          <AnimatePresence>
            {isSessionActive ? (
              <motion.div
                key="phone-off"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <PhoneOff size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="mic-icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <MicIcon size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
    </div>
  );
};

export default Visualizer;
