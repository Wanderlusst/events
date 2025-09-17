'use client';

import { useState, useEffect } from 'react';

export default function TestPage() {
  const [message, setMessage] = useState('Initializing...');

  useEffect(() => {
    setMessage('useEffect triggered');
    
    // Test simple timeout first
    setTimeout(() => {
      setMessage('Timeout triggered');
    }, 1000);
    
    // Test API call
    fetch('http://localhost:8000/api/events')
      .then(response => {
        setMessage('Fetch response received');
        return response.json();
      })
      .then(data => {
        setMessage(`API Success: ${data.data.length} events loaded`);
      })
      .catch(error => {
        setMessage(`API Error: ${error.message}`);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <div className="bg-blue-100 p-4 rounded">
        <strong>Status:</strong> {message}
      </div>
    </div>
  );
}
