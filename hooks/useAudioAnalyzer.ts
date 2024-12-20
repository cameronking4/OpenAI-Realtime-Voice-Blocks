import { useEffect, useRef, useState } from 'react';

interface AudioAnalyzerHook {
  isActive: boolean;
  currentVolume: number;
  start: () => void;
  stop: () => void;
}

export const useAudioAnalyzer = (audioElement: HTMLAudioElement | null, options = {
  interval: 100,
  fftSize: 256,
  volumeThreshold: 0.1
}): AudioAnalyzerHook => {
  const [isActive, setIsActive] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const intervalIdRef = useRef<number | null>(null);

  const initializeAnalyzer = () => {
    if (!audioElement || audioContextRef.current) return;

    try {
      // Create audio context
      audioContextRef.current = new (window.AudioContext || window.AudioContext)();
      
      // Create analyzer node
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = options.fftSize;
      
      // Connect audio element to analyzer
      const source = audioContextRef.current.createMediaElementSource(audioElement);
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    } catch (error) {
      console.error('Failed to initialize audio analyzer:', error);
    }
  };

  const getVolume = (): number => {
    if (!analyserRef.current) return 0;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteTimeDomainData(dataArray);

    // Calculate RMS (Root Mean Square)
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const float = (dataArray[i] - 128) / 128;
      sum += float * float;
    }
    
    return Math.sqrt(sum / dataArray.length);
  };

  const start = () => {
    if (!audioElement || isActive) return;
    
    initializeAnalyzer();
    setIsActive(true);

    // Start monitoring volume
    intervalIdRef.current = window.setInterval(() => {
      const volume = getVolume();
      setCurrentVolume(volume);

      // You can add additional logic here based on volume
      if (volume > options.volumeThreshold) {
        // Speech detected
        console.log('Speech detected with volume:', volume);
      }
    }, options.interval);
  };

  const stop = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    setIsActive(false);
    setCurrentVolume(0);
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      stop();
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  return {
    isActive,
    currentVolume,
    start,
    stop
  };
}; 