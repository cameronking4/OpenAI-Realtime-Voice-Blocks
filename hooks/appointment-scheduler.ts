import useWebRTCAudioSession from "@/hooks/use-webrtc";

const { handleStartStopClick } = useWebRTCAudioSession('alloy');

const useBookAppointment = handleStartStopClick;
export default useBookAppointment;
