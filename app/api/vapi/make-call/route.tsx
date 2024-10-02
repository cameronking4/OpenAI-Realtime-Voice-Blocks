// app/api/vapi/make-call/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  const API_KEY = process.env.VAPI_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ message: 'API key not found' }, { status: 500 });
  }

  const { phoneNumberId, assistantId, customerNumber } = await request.json();

  if (!phoneNumberId || !assistantId || !customerNumber) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  };

  const data = {
    phoneNumberId: phoneNumberId,
    assistantId: assistantId,
    customer: {
      number: customerNumber,
    },
  };

  try {
    const response = await axios.post('https://api.vapi.ai/call/phone', data, { headers });
    if (response.status === 201) {
      return NextResponse.json({ message: 'Call created successfully', data: response.data });
    } else {
      return NextResponse.json({ message: 'Failed to create call', error: response.data }, { status: response.status });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error', error: JSON.stringify(error, null, 2) }, { status: 500 });
  }
}
