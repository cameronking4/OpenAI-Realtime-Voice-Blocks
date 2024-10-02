import React from "react";
import useAppointment from "@/hooks/appointment-scheduler"; // Adjust the import path as needed
import Transcriber from "@/components/examples/transcriber"; // Adjust the import path as needed

function Appointment() {
  const { toggleCall, isSessionActive, conversation } = useAppointment();

  return (
    <section className="relative w-full mx-auto flex flex-col justify-center items-center gap-8">
      <div className="flex flex-col gap-5 text-center animate-hero-in">
        <span className="text-4xl mt-8 max-w-3xl font-medium tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text">
          Book an appointment with Cam @ Vapi Blocks!
        </span>
        <br/>
        <a
          rel="noopener noreferrer"
        >
          <button
            onClick={toggleCall}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary shadow hover:bg-indigo/30 hover:text-indigo h-9 px-4 py-2"
          >
            {isSessionActive ? "Stop Call" : "Start Call"}
          </button>
        </a>
      </div>
      <p>Live example of appointment scheduling. Please cancel if you do not plan on attending meeting with Cam.</p>
      <div className="relative flex justify-center items-center aspect-video w-full p-2">
        {/* <span className="absolute top-48 w-[calc(100%-70%)] h-[calc(100%-70%)] bg-purple-700 blur-[120px]"></span> */}
        <div className="size-full mx-auto">
          <Transcriber conversation={conversation} />
        </div>
      </div>
    </section>
  );
}

export default Appointment;
