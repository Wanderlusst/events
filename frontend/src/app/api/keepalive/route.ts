import { NextRequest, NextResponse } from 'next/server';

const RENDER_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://events-kax8.onrender.com';

export async function GET(request: NextRequest) {
  try {
    console.log('Keep-alive job triggered at:', new Date().toISOString());
    
    // Ping the Render backend health endpoint
    const response = await fetch(`${RENDER_BACKEND_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Set a reasonable timeout
      signal: AbortSignal.timeout(10000), // 10 seconds timeout
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Backend is alive:', data);
      
      return NextResponse.json({
        success: true,
        message: 'Backend keep-alive successful',
        timestamp: new Date().toISOString(),
        backendStatus: data,
      });
    } else {
      console.error('Backend health check failed:', response.status, response.statusText);
      
      return NextResponse.json({
        success: false,
        message: 'Backend health check failed',
        status: response.status,
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Keep-alive job failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Keep-alive job failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

// Also support POST requests for more flexibility
export async function POST(request: NextRequest) {
  return GET(request);
}
