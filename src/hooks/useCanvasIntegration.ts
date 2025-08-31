import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CanvasSyncResult {
  success: boolean;
  syncedPatients?: Array<{
    id: string;
    name: string;
    mrn: string;
  }>;
  message?: string;
  error?: string;
}

export const useCanvasIntegration = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<CanvasSyncResult | null>(null);

  const connectToCanvas = useCallback(async () => {
    setIsConnecting(true);
    try {
      // Get authorization URL from our edge function
      const { data, error } = await supabase.functions.invoke('canvas-auth', {
        body: { state: 'initial-connection' }
      });

      if (error) throw error;

      // Open Canvas authorization in new window
      const authWindow = window.open(
        data.authUrl,
        'canvas-auth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      // Listen for authorization callback
      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'CANVAS_AUTH_SUCCESS') {
          const { code } = event.data;
          
          // Exchange code for access token
          const { data: tokenData, error: tokenError } = await supabase.functions.invoke('canvas-auth', {
            body: { code }
          });

          if (tokenError) {
            throw tokenError;
          }

          setAccessToken(tokenData.accessToken);
          setIsConnected(true);
          toast.success('Successfully connected to Canvas Medical!');
          authWindow?.close();
        } else if (event.data.type === 'CANVAS_AUTH_ERROR') {
          throw new Error(event.data.error || 'Authorization failed');
        }
      };

      window.addEventListener('message', handleMessage);
      
      // Clean up listener when window closes
      const checkClosed = setInterval(() => {
        if (authWindow?.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          setIsConnecting(false);
        }
      }, 1000);

    } catch (error) {
      console.error('Canvas connection error:', error);
      toast.error('Failed to connect to Canvas Medical');
      setIsConnecting(false);
    }
  }, []);

  const syncData = useCallback(async () => {
    if (!accessToken) {
      toast.error('Please connect to Canvas first');
      return;
    }

    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('canvas-sync', {
        body: { accessToken }
      });

      if (error) throw error;

      setSyncResult(data);
      if (data.success) {
        toast.success(data.message || 'Data synced successfully');
      } else {
        toast.error(data.error || 'Sync failed');
      }
      
      return data;
    } catch (error) {
      console.error('Canvas sync error:', error);
      toast.error('Failed to sync data from Canvas');
      const errorResult = { success: false, error: error.message };
      setSyncResult(errorResult);
      return errorResult;
    } finally {
      setIsSyncing(false);
    }
  }, [accessToken]);

  const disconnect = useCallback(() => {
    setAccessToken(null);
    setIsConnected(false);
    setSyncResult(null);
    toast.info('Disconnected from Canvas Medical');
  }, []);

  return {
    isConnecting,
    isSyncing,
    isConnected,
    syncResult,
    connectToCanvas,
    syncData,
    disconnect
  };
};