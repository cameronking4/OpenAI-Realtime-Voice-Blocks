import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const apiKey = process.env.CAL_API_KEY;

async function createBooking({ start, name, email, smsReminderNumber }: { start: string; name: string; email: string; smsReminderNumber?: string }) {
  const startDateTime = new Date(start);
  const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // Add 30 minutes to start time
  const end = endDateTime.toISOString();

  const response = await axios.post(
    `https://api.cal.com/v1/bookings?apiKey=${apiKey}`,
    {
      eventTypeId: 873076,
      start: start,
      end: end,
      responses: {
        name: name,
        email: email,
        metadata: {},
        location: "Google Meet"
      },
      timeZone: "America/Los_Angeles",
      language: "en",
      title: "30min Meeting with Cam (Founder of VapiBlocks)",
      description: "Discuss partnership with VapiBlocks or ways to add Voice AI to your app",
      status: "ACCEPTED",
      smsReminderNumber: smsReminderNumber || null,
      metadata: {}
    }
  );

  return response.data;
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    console.log(message);
    if (message.type === 'function-call' && message.functionCall) {
      const { parameters } = message.functionCall;
      
      const result = await createBooking(parameters);
      const jsonResponse = NextResponse.json({ result: "The booking was created successfully.", response: result }, { status: 200 });
      jsonResponse.headers.set('Access-Control-Allow-Origin', '*');
      jsonResponse.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
      jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return jsonResponse;
    } else {
      const jsonResponse = NextResponse.json({ message: `Unhandled message type: ${message.type}` }, { status: 400 });
      jsonResponse.headers.set('Access-Control-Allow-Origin', '*');
      jsonResponse.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
      jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return jsonResponse;
    }
  } catch (error) {
    console.error('Error processing request:', error);
    const jsonResponse = NextResponse.json({ message: error }, { status: 500 });
    jsonResponse.headers.set('Access-Control-Allow-Origin', '*');
    jsonResponse.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return jsonResponse;
  }
}

export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
