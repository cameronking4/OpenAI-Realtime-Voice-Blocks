import React from 'react';
import { MicIcon } from 'lucide-react';
import useVapiAssistant from '@/hooks/create-assistant-vapi';

const VapiAssistant: React.FC = () => {
  const { startAssistant, stopAssistant, transcription } = useVapiAssistant();

  return (
    <div>
      <button onClick={startAssistant}>
        <MicIcon />
      </button>
      <button onClick={stopAssistant}>
        Stop
      </button>
      <div>
        <p>Transcription:</p>
        <p>{transcription}</p>
      </div>
    </div>
  );
};

export default VapiAssistant;
