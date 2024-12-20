import useWebRTCAudioSession from "@/hooks/use-webrtc";

const { handleStartStopClick, isSessionActive, conversation } = useWebRTCAudioSession('alloy');

const useBookAppointment = { handleStartStopClick, isSessionActive, conversation };
export default useBookAppointment;
