"use client";

import { useEffect, useState } from 'react';
import { testCORS, checkAPIHealth, getEvents } from '@/api/api';

export default function CORSTest() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [status, setStatus] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testCorsConnection = async () => {
      try {
        setLoading(true);
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const results: any = {};
        
        // Test 1: Health endpoint
        try {
          results.health = await checkAPIHealth();
        } catch (e) {
          results.health = { error: (e as Error).message };
        }
        
        // Test 2: CORS endpoint
        try {
          results.cors = await testCORS();
        } catch (e) {
          results.cors = { error: (e as Error).message };
        }
        
        // Test 3: Actual data endpoint
        try {
          const events = await getEvents();
          results.events = { 
            success: true, 
            count: events.length,
            sample: events.slice(0, 2) 
          };
        } catch (e) {
          results.events = { error: (e as Error).message };
        }
        
        results.timestamp = new Date().toISOString();
        setStatus(results);
      } catch (error) {
        setStatus({ 
          globalError: (error as Error).message,
          timestamp: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };

    testCorsConnection();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-sm text-blue-600">Testing CORS connection...</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono">
      <h3 className="font-bold mb-2 text-gray-800">CORS Test Results:</h3>
      <pre className="whitespace-pre-wrap">{JSON.stringify(status, null, 2)}</pre>
      
      {/* Simple status indicator */}
      <div className={`mt-2 p-2 rounded ${
        status.events?.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {status.events?.success 
          ? `✅ CORS Working - ${status.events.count} events loaded` 
          : '❌ CORS Issue - Check backend configuration'
        }
      </div>
    </div>
  );
}