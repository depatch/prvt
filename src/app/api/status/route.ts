import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // You can add more detailed checks here, such as database connectivity
    const status = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || '1.0.0',
      services: {
        xmtp: 'operational',
        web3auth: 'operational',
        litProtocol: 'operational',
        // Add more services as needed
      }
    };

    return NextResponse.json(status, { status: 200 });
  } catch (error) {
    console.error('Status check failed:', error);
    return NextResponse.json({ status: 'error', message: 'Status check failed' }, { status: 500 });
  }
}