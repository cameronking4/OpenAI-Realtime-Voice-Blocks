"use client";
import React, { useEffect, useRef, useState } from 'react';
import { MicOff, Mic } from 'lucide-react';
import useVapi from '@/hooks/use-vapi';

interface AudioVisualizerProps {
  audioData: Uint8Array;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ audioData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (canvas && context) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    draw();
  }, [audioData]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const { width, height } = canvas;
    context.clearRect(0, 0, width, height);

    const sliceWidth = width / audioData.length;
    const centerY = height / 2;

    context.lineWidth = 2;
    context.strokeStyle = '#9E9E9E';
    context.beginPath();

    for (let i = 0; i < audioData.length; i++) {
      const v = audioData[i] / 255.0;
      const y = centerY + (v - 0.5) * height;

      if (i === 0) {
        context.moveTo(i * sliceWidth, y);
      } else {
        context.lineTo(i * sliceWidth, y);
      }
    }

    context.stroke();
  };

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

interface AudioAnalyzerProps {
  volumeLevel: number;
}

const AudioAnalyzer: React.FC<AudioAnalyzerProps> = ({ volumeLevel }) => {
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(128));

  useEffect(() => {
    const updateAudioData = () => {
      const dataArray = new Uint8Array(128);

      for (let i = 0; i < dataArray.length; i++) {
        const variability = (Math.random() - 0.5) * 2;
        dataArray[i] = Math.min(Math.max(128 + volumeLevel * variability * 128, 0), 255);
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
  }, [volumeLevel]);

  return <AudioVisualizer audioData={audioData} />;
};

const MinimalComponent: React.FC = () => {
  const { volumeLevel, isSessionActive, toggleCall } = useVapi();

  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      <div key="visualizer" className="flex items-center justify-center">
        <button
          key="callButton"
          onClick={toggleCall}
          className="px-4 rounded-md"
        >
          {isSessionActive ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        <div className="rounded-4xl p-4">
          <AudioAnalyzer volumeLevel={volumeLevel} />
        </div>
      </div>
    </div>
  );
};

export default MinimalComponent;
