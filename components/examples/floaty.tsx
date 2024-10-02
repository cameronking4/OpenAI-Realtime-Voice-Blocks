import { PhoneCallIcon, MicIcon, AudioLines} from 'lucide-react';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useVapi from '@/hooks/use-vapi'; // Adjust the import path as needed

const FloatingCircle = ({ isActive, volumeLevel, handleClick }: { isActive: boolean, volumeLevel: number, handleClick: () => void }) => {
  const getIcon = () => {
    if (!isActive) {
      return <PhoneCallIcon className="text-secondary" />;
    } else if (isActive && volumeLevel > 0) {
      return <AudioLines className="text-secondary" />;
    } else {
      return <MicIcon className="text-secondary" />;
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className="relative flex items-center justify-center w-16 h-16">
        {isActive && volumeLevel > 0 && (
          <>
            <motion.div
              className="absolute w-16 h-16 rounded-full bg-foreground z-0"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
            />
            <motion.div
              className="absolute w-16 h-16 rounded-full bg-foreground z-0"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            />
            <motion.div
              className="absolute w-16 h-16 rounded-full bg-foreground z-0"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.5 }}
            />
          </>
        )}
        <div 
          className="relative flex items-center justify-center w-16 h-16 rounded-full shadow-xl cursor-pointer z-10 bg-foreground"
          onClick={handleClick}
        >
          {getIcon()}
        </div>
      </div>
    </div>
  );
};

const FloatyExample = () => {
  const [showCircle, setShowCircle] = useState(false);
  const { volumeLevel, isSessionActive, toggleCall } = useVapi();

  const handleButtonClick = () => {
    setShowCircle(!showCircle);
  };

  return (
    <div className="App">
      <button
        onClick={handleButtonClick}
        className="px-4 py-2 rounded-lg text-sm shadow-md focus:outline-none border hover:bg-primary-dark transition-colors duration-200 ease-in-out"
      >
        Toggle Floaty
      </button>
      {showCircle && <FloatingCircle isActive={isSessionActive} volumeLevel={volumeLevel} handleClick={toggleCall} />}
    </div>
  );
}

export default FloatyExample;
