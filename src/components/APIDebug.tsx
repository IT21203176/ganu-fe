"use client";

import { useEffect, useState } from 'react';
import { checkAPIHealth, debugEvents, getEvents } from '@/api/api';

export default function APIDebug() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [status, setStatus] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testAPI = async () => {
      try {
        setLoading(true);
        
        // Test health endpoint
        const health = await checkAPIHealth();
        
        // Test events endpoint
        const events = await getEvents();
        
        // Test debug endpoint
        let debugData = { error: 'Not available' };
        try {
          debugData = await debugEvents();
        } catch (e) {
          debugData = { error: (e as Error).message };
        }

        setStatus({
          health,
          eventsCount: events.length,
          debug: debugData,
          timestamp: new Date().toISOString(),
          frontendUrl: typeof window !== 'undefined' ? window.location.origin : 'server'
        });
      } catch (error) {
        setStatus({ 
          error: (error as Error).message,
          timestamp: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-gray-100 border rounded-lg">
        <div className="text-sm text-gray-600">Testing API connection...</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 border rounded-lg text-xs font-mono">
      <h3 className="font-bold mb-2">API Debug Info:</h3>
      <pre>{JSON.stringify(status, null, 2)}</pre>
    </div>
  );
}