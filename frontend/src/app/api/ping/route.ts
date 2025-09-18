import { NextRequest, NextResponse } from 'next/server';

const RENDER_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://events-kax8.onrender.com';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Try multiple endpoints for better reliability
    const endpoints = [
      `${RENDER_BACKEND_URL}/api/health`,
      `${RENDER_BACKEND_URL}/`,
      `${RENDER_BACKEND_URL}/api/events`,
    ];
    
    let success = false;
    let lastError = null;
    let responseTime = 0;
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'User-Agent': 'Vercel-KeepAlive/1.0',
            'Accept': 'application/json',
          },
          // Shorter timeout for faster failover
          signal: AbortSignal.timeout(8000), // 8 seconds timeout
        });
        
        responseTime = Date.now() - startTime;
        
        if (response.ok) {
          success = true;
          break;
        }
      } catch (error) {
        lastError = error;
      }
    }
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Backend ping successful',
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        backendUrl: RENDER_BACKEND_URL,
        status: 'alive',
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'All backend endpoints failed',
        timestamp: new Date().toISOString(),
        responseTime: `${Date.now() - startTime}ms`,
        backendUrl: RENDER_BACKEND_URL,
        lastError: lastError instanceof Error ? lastError.message : 'Unknown error',
        status: 'down',
      }, { status: 503 });
    }
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      success: false,
      message: 'Ping job failed',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      backendUrl: RENDER_BACKEND_URL,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'error',
    }, { status: 500 });
  }
}

// Support POST for external cron services
export async function POST(request: NextRequest) {
  return GET(request);
}
