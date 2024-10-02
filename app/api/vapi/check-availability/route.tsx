import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const bearerToken = process.env.CAL_API_KEY;
const username = process.env.CAL_USERNAME;
const userId = process.env.CAL_USERID;

async function checkAvailability(parameters: { dateFrom: string; dateTo: string; }) {
  const { dateFrom, dateTo } = parameters;
  const response = await axios.get('https://api.cal.com/v1/availability', {
    params: {
      apiKey: bearerToken,
      userId: userId,
      username: username,
      dateFrom: dateFrom,
      dateTo: dateTo,
      eventTypeId: '873076'
    }
  });
  return response.data;
}

export async function POST(request: NextRequest) {
  console.log(request);
  try {
    const { message } = await request.json();
    console.log(message);
    if (message.type === 'function-call' && message.functionCall) {
      const { parameters } = message.functionCall;

      const result = await checkAvailability(parameters);
      const response = NextResponse.json({ result }, { status: 200 });
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return response;
    } else {
      const response = NextResponse.json({ message: `Unhandled message type: ${message.type}` }, { status: 400 });
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return response;
    }
  } catch (error) {
    console.error('Error processing request:', error);
    const response = NextResponse.json({ message: error }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  }
}

export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
