import React, { useState, useEffect } from 'react';
import AbstractBall from '@/components/abstract-ball';
import ConfigSheet from '@/components/examples/config-drawer';
import useWebRTCAudioSession from '@/hooks/use-webrtc';
import { Button } from '@/components/ui/button';
import { MicIcon, PhoneOff } from 'lucide-react';

const globConfig = {
  perlinTime: 50.0,
  perlinDNoise: 2.5,
  chromaRGBr: 7.5,
  chromaRGBg: 5,
  chromaRGBb: 7,
  chromaRGBn: 0,
  chromaRGBm: 1.0,
  sphereWireframe: false,
  spherePoints: false,
  spherePsize: 1.0,
  cameraSpeedY: 0.0,
  cameraSpeedX: 0.0,
  cameraZoom: 175,
  cameraGuide: false,
  perlinMorph: 5.5,
};

const ParentComponent: React.FC = () => {
  const { currentVolume, isSessionActive, handleStartStopClick } = useWebRTCAudioSession('alloy');
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
    <div style={{ width: '100%', height: '100%' }}>
      <ConfigSheet config={config} setConfig={setConfig} />
      <AbstractBall {...config} />
      <div className="flex justify-center mt-4">
        <Button onClick={handleStartStopClick} className='m-2'>
          {isSessionActive ? <PhoneOff size={18} /> : <MicIcon size={18} />}
        </Button>
      </div>
    </div>
  );
};

export default ParentComponent;
