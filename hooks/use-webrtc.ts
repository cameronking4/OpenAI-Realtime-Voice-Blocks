"use client";

import { useState, useRef, useEffect } from "react";
import { Tool } from "@/lib/tools";
import { Message } from "@/lib/conversations";
const useWebRTCAudioSession = (voice: string, tools?: Tool[]) => {
  const [status, setStatus] = useState("");
  const [isSessionActive, setIsSessionActive] = useState(false);
  const audioIndicatorRef = useRef<HTMLDivElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const [msgs, setMsgs] = useState<any[]>([]);
  const [conversation, setConversation] = useState<any[]>([]);

  // Add function registry
  const functionRegistry = useRef<Record<string, Function>>({});
  const [currentVolume, setCurrentVolume] = useState(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const volumeIntervalRef = useRef<number | null>(null);

  // Add method to register tool functions
  const registerFunction = (name: string, fn: Function) => {
    functionRegistry.current[name] = fn;
  };

  // Add data channel configuration
  const configureDataChannel = (dataChannel: RTCDataChannel) => {
    const sessionUpdate = {
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        tools: tools || []
      }
    };

    dataChannel.send(JSON.stringify(sessionUpdate));
  };

  // Add data channel message handler
  const handleDataChannelMessage = async (event: MessageEvent) => {
    try {
      const msg = JSON.parse(event.data);
      
      if (msg.type === 'response.audio_transcript.delta') {
        // Add new message or update existing one
        const newMessage: Message = {
          role: 'assistant',
          text: msg.delta,
          timestamp: new Date().toISOString(),
          isFinal: false
        };
        
        setConversation(prev => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && !lastMsg.isFinal && lastMsg.role === 'assistant') {
            // Update existing message
            const updatedMessages = [...prev];
            updatedMessages[prev.length - 1] = {
              ...lastMsg,
              text: lastMsg.text + msg.delta
            };
            return updatedMessages;
          } else {
            // Add new message
            return [...prev, newMessage];
          }
        });
      }

      if (msg.type === 'response.audio_transcript.done') {
        // Mark last message as final
        setConversation(prev => {
          const updatedMessages = [...prev];
          if (updatedMessages.length > 0) {
            updatedMessages[updatedMessages.length - 1].isFinal = true;
          }
          return updatedMessages;
        });
      }

      if (msg.type === 'input_audio_buffer.committed') {
        // Add user message
        const userMessage: Message = {
          role: 'user',
          text: msg.transcript || '',
          timestamp: new Date().toISOString(),
          isFinal: true
        };
        setConversation(prev => [...prev, userMessage]);
      }

      setMsgs(prevMsgs => [...prevMsgs, msg]);
      return msg;
    } catch (error) {
      console.error('Error handling data channel message:', error);
    }
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  const getEphemeralToken = async () => {
    const response = await fetch('/api/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data.client_secret.value;
  };

  const setupAudioVisualization = (stream: MediaStream) => {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256;

    source.connect(analyzer);

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateIndicator = () => {
      if (!audioContext) return;

      analyzer.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;

      if (audioIndicatorRef.current) {
        audioIndicatorRef.current.classList.toggle("active", average > 30);
      }

      requestAnimationFrame(updateIndicator);
    };

    updateIndicator();
    audioContextRef.current = audioContext;
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

  const startSession = async () => {
    try {
      setStatus("Requesting microphone access...");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      setupAudioVisualization(stream);

      setStatus("Fetching ephemeral token...");
      const ephemeralToken = await getEphemeralToken();

      setStatus("Establishing connection...");

      const pc = new RTCPeerConnection();
      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      
      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0];
        
        // Set up audio analysis
        const audioContext = new (window.AudioContext || window.AudioContext)();
        const source = audioContext.createMediaStreamSource(e.streams[0]);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        
        source.connect(analyser);
        analyserRef.current = analyser;

        // Start volume monitoring
        volumeIntervalRef.current = window.setInterval(() => {
          const volume = getVolume();
          setCurrentVolume(volume);
          
          // Optional: Log when speech is detected
        //   if (volume > 0.1) {
        //     console.log('Speech detected with volume:', volume);
        //   }
        }, 100);
      };

      // Add data channel
      const dataChannel = pc.createDataChannel('response');
      dataChannelRef.current = dataChannel;

      dataChannel.onopen = () => {
        configureDataChannel(dataChannel);
      };

      dataChannel.onmessage = handleDataChannelMessage;

      pc.addTrack(stream.getTracks()[0]);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";
      const response = await fetch(`${baseUrl}?model=${model}&voice=${voice}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${ephemeralToken}`,
          "Content-Type": "application/sdp",
        },
      });

      await pc.setRemoteDescription({
        type: "answer",
        sdp: await response.text(),
      });

      peerConnectionRef.current = pc;
      setIsSessionActive(true);
      setStatus("Session established successfully!");
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err}`);
      stopSession();
    }
  };

  const stopSession = () => {
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }

    if (audioIndicatorRef.current) {
      audioIndicatorRef.current.classList.remove("active");
    }

    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
      volumeIntervalRef.current = null;
    }
    
    if (analyserRef.current) {
      analyserRef.current = null;
    }
    
    setCurrentVolume(0);
    setIsSessionActive(false);
    setStatus("");
    setMsgs([]);
    setConversation([]);
  };

  const handleStartStopClick = () => {
    if (isSessionActive) {
      stopSession();
    } else {
      startSession();
    }
  };

  return {
    status,
    isSessionActive,
    audioIndicatorRef,
    startSession,
    stopSession,
    handleStartStopClick,
    registerFunction,
    msgs,
    currentVolume,
    conversation
  };
};

export default useWebRTCAudioSession;