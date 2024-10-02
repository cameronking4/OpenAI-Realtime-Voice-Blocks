import { useEffect, useRef, useState, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

const routes: { [key: string]: string } = {
  "visualizer": "/components/visualizer",
  "orb": "/components/orb",
  "radial": "/components/radial",
  "siri": "/components/siri"
};

const useVapiFactory = (publicKey: string, assistantId: string) => {
  const useVapi = () => {
    const [volumeLevel, setVolumeLevel] = useState(0);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [conversation, setConversation] = useState<
      { role: string; text: string; timestamp: string; isFinal: boolean }[]
    >([]);
    const vapiRef = useRef<any>(null);

    const initializeVapi = useCallback(() => {
      if (!vapiRef.current) {
        const vapiInstance = new Vapi(publicKey);
        vapiRef.current = vapiInstance;

        vapiInstance.on('call-start', () => {
          setIsSessionActive(true);
        });

        vapiInstance.on('call-end', () => {
          setIsSessionActive(false);
          setConversation([]); // Reset conversation on call end
        });

        vapiInstance.on('volume-level', (volume: number) => {
          setVolumeLevel(volume);
        });

        vapiInstance.on('message', (message: any) => {
          if (message.type === 'transcript') {
            setConversation((prev) => {
              const timestamp = new Date().toLocaleTimeString();
              const updatedConversation = [...prev];
              if (message.transcriptType === 'final') {
                // Find the partial message to replace it with the final one
                const partialIndex = updatedConversation.findIndex(
                  (msg) => msg.role === message.role && !msg.isFinal
                );
                if (partialIndex !== -1) {
                  updatedConversation[partialIndex] = {
                    role: message.role,
                    text: message.transcript,
                    timestamp: updatedConversation[partialIndex].timestamp,
                    isFinal: true,
                  };
                } else {
                  updatedConversation.push({
                    role: message.role,
                    text: message.transcript,
                    timestamp,
                    isFinal: true,
                  });
                }
              } else {
                // Add partial message or update the existing one
                const partialIndex = updatedConversation.findIndex(
                  (msg) => msg.role === message.role && !msg.isFinal
                );
                if (partialIndex !== -1) {
                  updatedConversation[partialIndex] = {
                    ...updatedConversation[partialIndex],
                    text: message.transcript,
                  };
                } else {
                  updatedConversation.push({
                    role: message.role,
                    text: message.transcript,
                    timestamp,
                    isFinal: false,
                  });
                }
              }
              return updatedConversation;
            });
          }

          if (message.type === 'function-call' && message.functionCall.name === 'changeUrl') {
            const command = message.functionCall.parameters.url.toLowerCase();
            console.log(command);
            const newUrl = routes[command];
            if (newUrl) {
              window.location.href = newUrl;
            } else {
              console.error('Unknown route:', command);
            }
          }
          
        });

        vapiInstance.on('error', (e: Error) => {
          console.error('Vapi error:', e);
        });
      }
    }, [publicKey]);

    useEffect(() => {
      initializeVapi();

      return () => {
        if (vapiRef.current) {
          vapiRef.current.stop();
          vapiRef.current = null;
        }
      };
    }, [initializeVapi]);

    const toggleCall = async () => {
      try {
        if (isSessionActive) {
          await vapiRef.current.stop();
        } else {
          await vapiRef.current.start(assistantId);
        }
      } catch (err) {
        console.error('Error toggling Vapi session:', err);
      }
    };

    return { volumeLevel, isSessionActive, conversation, toggleCall };
  };

  return useVapi;
};

export default useVapiFactory;
