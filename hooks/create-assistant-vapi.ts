import { useEffect, useState } from 'react';
import Vapi from '@vapi-ai/web';
import { CreateAssistantDTO } from '@vapi-ai/web/dist/api';

interface VapiMessage {
  type: string;
  functionCall?: {
    name: string;
    parameters: any;
  };
  transcript?: {
    text: string;
    isFinal: boolean;
  };
}

const useVapiAssistant = () => {
  const [vapiInstance, setVapiInstance] = useState<Vapi | null>(null);
  const [transcription, setTranscription] = useState<string>('');

  useEffect(() => {
    const initializeVapi = () => {
      const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY as string);
      vapi.on('message', (message: VapiMessage) => {
        console.log('Vapi message:', message);
        handleVapiMessage(message);
      });

      setVapiInstance(vapi);
    };

    initializeVapi();
  }, []);

  const handleVapiMessage = (message: VapiMessage) => {
    if (message.type === 'function-call') {
      console.log(JSON.stringify(message));
    }
    if (message.type === 'function-call' && message.functionCall?.name === 'createVapiConfig') {
      console.log("function called: ", JSON.stringify(message, null, 2))
      fetch('/api/create-vapi-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message.functionCall.parameters)
      })
        .then(response => response.json())
        .catch(error => {
          console.error('Error creating Vapi config:', error);
        });
      
    }
    if (message.type === 'function-call' && message.functionCall?.name === 'createVapiConfig') {
      console.log("function called: ", JSON.stringify(message, null, 2))
      fetch('/api/create-vapi-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message.functionCall.parameters)
      })
        .then(response => response.json())
        .catch(error => {
          console.error('Error creating Vapi config:', error);
        });
    }
    if (message.type === 'function-call' && message.functionCall?.name === 'createVapiConfig') {
      console.log("function called: ", JSON.stringify(message, null, 2))
      fetch('/api/create-vapi-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message.functionCall.parameters)
      })
        .then(response => response.json())
        .catch(error => {
          console.error('Error creating Vapi config:', error);
        });
    }
    if (message.type === 'transcript' && message.transcript) {
      if (message.transcript.text) {
        setTranscription(prev => prev + ' ' + message.transcript?.text);
      } else {
        console.log('Partial transcript:', message.transcript.text);
      }
    }
  };

  const createVapiConfig = (config: Partial<CreateAssistantDTO>): CreateAssistantDTO => {
    return {
      transcriber: {
        provider: 'deepgram',
        model: 'nova-2',
      },
      model: {
        provider: "openai",
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: assistantText,
          },
        ],
        tools: [
          {
            "async": true,
            "messages": [
              {
                "type": "request-start",
                "content": "Booking an appointment.",
              }
            ],
            "type": "function",
            "function": {
              "name": "bookAppointment",
              "description": "Books an appointment for the user.",
              "parameters": {
                "type": "object",
                "properties": {
                  "datetime": {
                    "type": "string",
                    "description": "The date and time of the appointment in ISO format."
                  }
                },
                "required": [
                  "datetime"
                ]
              }
            },
            "server": {
              "url": "https://your-server-url.com/book-appointment",
              "secret": "your-server-secret"
            }
          }
          ]          
      },
      voice: {
        provider: 'playht',
        voiceId: 'jennifer',
      },
      firstMessage: 'Hi, I am VapiHelper. How can I assist you with your Vapi configurations today?',
      endCallMessage: 'Thank you for using Vapi. Have a great day!',
      recordingEnabled: true,
      ...config
    };
  };

  const startAssistant = () => {
    const assistantConfig = createVapiConfig({});
    if (vapiInstance) {
      vapiInstance.start(assistantConfig);
    }
  };

  const stopAssistant = () => {
    if (vapiInstance) {
      vapiInstance.stop();
    }
  };

  return { startAssistant, stopAssistant, transcription };
};

const assistantText =  `You are helpful assistant for Vapiblocks.com. Vapiblocks allows you to drop in Voice AI into your web apps. You offer users the ability to create their own Vapi configuration just by describing it to you.
Here is an example Vapi configuration (minimal):
{
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en-US",
  },
  model: {
    provider: "openai",
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
    ],
  },
  voice: {
    provider: "playht",
    voiceId: "jennifer",
  },
  name: "My Inline Assistant",
  ...
})
Here is example complex Vapi configuration:
{
  "transcriber": {
    "provider": "deepgram",
    "model": "nova-2",
    "language": "bg",
    "smartFormat": true,
    "keywords": [
      "<string>"
    ]
  },
  "model": {
    "messages": [
      {
        "content": "<string>",
        "role": "assistant"
      }
    ],
    "tools": [
      {
        "async": true,
        "messages": [
          {
            "type": "request-start",
            "content": "<string>",
            "conditions": [
              {
                "param": "<string>",
                "value": "<string>",
                "operator": "eq"
              }
            ]
          }
        ],
        "type": "transferCall",
        "destinations": [
          {
            "type": "assistant",
            "assistantName": "<string>",
            "message": "<string>",
            "description": "<string>"
          }
        ],
        "function": {
          "name": "<string>",
          "description": "<string>",
          "parameters": {
            "type": "object",
            "properties": {},
            "required": [
              "<string>"
            ]
          }
        },
        "server": {
          "timeoutSeconds": 10,
          "url": "<string>",
          "secret": "<string>"
        }
      }
    ],
    "toolIds": [
      "<string>"
    ],
    "provider": "anyscale",
    "model": "<string>",
    "temperature": 1,
    "knowledgeBase": {
      "provider": "canonical",
      "topK": 5.5,
      "fileIds": [
        "<string>"
      ]
    },
    "maxTokens": 525,
    "emotionRecognitionEnabled": true
  },
  "voice": {
    "inputPreprocessingEnabled": true,
    "inputReformattingEnabled": true,
    "inputMinCharacters": 30,
    "inputPunctuationBoundaries": [
      "。",
      "，",
      ".",
      "!",
      "?",
      ";",
      ")",
      "،",
      "۔",
      "।",
      "॥",
      "|",
      "||",
      ",",
      ":"
    ],
    "fillerInjectionEnabled": true,
    "provider": "azure",
    "voiceId": "andrew",
    "speed": 1.25
  },
  "firstMessageMode": "assistant-speaks-first",
  "recordingEnabled": true,
  "hipaaEnabled": true,
  "clientMessages": [
    "conversation-update",
    "function-call",
    "hang",
    "model-output",
    "speech-update",
    "status-update",
    "transcript",
    "tool-calls",
    "user-interrupted",
    "voice-input"
  ],
  "serverMessages": [
    "conversation-update",
    "end-of-call-report",
    "function-call",
    "hang",
    "speech-update",
    "status-update",
    "tool-calls",
    "transfer-destination-request",
    "user-interrupted"
  ],
  "silenceTimeoutSeconds": 30,
  "responseDelaySeconds": 0.4,
  "llmRequestDelaySeconds": 0.1,
  "numWordsToInterruptAssistant": 5,
  "maxDurationSeconds": 1800,
  "backgroundSound": "office",
  "backchannelingEnabled": true,
  "backgroundDenoisingEnabled": true,
  "modelOutputInMessagesEnabled": true,
  "isServerUrlSecretSet": {},
  "name": "<string>",
  "firstMessage": "<string>",
  "voicemailDetection": {
    "provider": "twilio",
    "voicemailDetectionTypes": [
      "machine_end_beep",
      "machine_end_silence"
    ],
    "enabled": true,
    "machineDetectionTimeout": 31,
    "machineDetectionSpeechThreshold": 3500,
    "machineDetectionSpeechEndThreshold": 2750,
    "machineDetectionSilenceTimeout": 6000
  },
  "voicemailMessage": "<string>",
  "endCallMessage": "<string>",
  "endCallPhrases": [
    "<string>"
  ],
  "metadata": {},
  "serverUrl": "<string>",
  "serverUrlSecret": "<string>",
  "analysisPlan": {
    "summaryPrompt": "<string>",
    "summaryRequestTimeoutSeconds": 10.5,
    "structuredDataRequestTimeoutSeconds": 10.5,
    "successEvaluationPrompt": "<string>",
    "successEvaluationRubric": "NumericScale",
    "successEvaluationRequestTimeoutSeconds": 10.5,
    "structuredDataPrompt": "<string>",
    "structuredDataSchema": {
      "type": "string",
      "items": {},
      "properties": {},
      "description": "<string>",
      "required": [
        "<string>"
      ]
    }
  },
  "artifactPlan": {
    "videoRecordingEnabled": true
  },
  "id": "<string>",
  "orgId": "<string>",
  "createdAt": "2023-11-07T05:31:56Z",
  "updatedAt": "2023-11-07T05:31:56Z"
}

Either way this configuration json will be used and passed to a newly created Vapi instance on their behalf. It is your job to guide user to create .Once you have all you need use the createVapiAssistamt function.

Below are the instructions for conversation. All conversations must follow this flow and complete each step at a time (user does not know these steps and shouldn't, it's for u to conduct conversation):
1. Do you want to use OpenAI as provider?
2. Do you like deepgram for the rest?
3. What should it say to begin call? 
4. What do u want system prompt to be?
5. Ask if recording should be enabled.
6. Say "I got all requirements" and then use the function createVapiConfig from the tools you have.
7. Task complete if you've ran the createVapiConfig function from your tools.

Do not read the configuration you make aloud, it'll be too long and technical, just run function when fields are all known.`
export default useVapiAssistant;
