import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ExternalLink, Database, CheckCircle } from 'lucide-react';

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

export const CanvasIntegration = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<CanvasSyncResult | null>(null);

  const handleCanvasConnect = async () => {
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
  };

  const handleSyncData = async () => {
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
    } catch (error) {
      console.error('Canvas sync error:', error);
      toast.error('Failed to sync data from Canvas');
      setSyncResult({ success: false, error: error.message });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          Canvas Medical Integration
        </CardTitle>
        <CardDescription>
          Connect to Canvas Medical EHR to sync real patient data and enhance AI risk assessments with actual clinical records.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className="text-sm font-medium">
              {isConnected ? 'Connected to Canvas Medical' : 'Not connected'}
            </span>
          </div>
          {isConnected && <Badge variant="secondary">Active</Badge>}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleCanvasConnect}
            disabled={isConnecting || isConnected}
            className="flex-1"
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : isConnected ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Connected
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Connect to Canvas
              </>
            )}
          </Button>

          <Button
            onClick={handleSyncData}
            disabled={!isConnected || isSyncing}
            variant="outline"
            className="flex-1"
          >
            {isSyncing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Sync Patient Data
              </>
            )}
          </Button>
        </div>

        {syncResult && (
          <div className="mt-4 p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {syncResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <ExternalLink className="h-4 w-4 text-red-500" />
              )}
              <span className="font-medium">
                {syncResult.success ? 'Sync Successful' : 'Sync Failed'}
              </span>
            </div>
            
            {syncResult.message && (
              <p className="text-sm text-muted-foreground mb-2">{syncResult.message}</p>
            )}
            
            {syncResult.error && (
              <p className="text-sm text-red-600">{syncResult.error}</p>
            )}
            
            {syncResult.syncedPatients && syncResult.syncedPatients.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium mb-2">Synced Patients:</p>
                <div className="space-y-1">
                  {syncResult.syncedPatients.slice(0, 5).map((patient) => (
                    <div key={patient.id} className="text-xs text-muted-foreground">
                      {patient.name} (MRN: {patient.mrn})
                    </div>
                  ))}
                  {syncResult.syncedPatients.length > 5 && (
                    <div className="text-xs text-muted-foreground">
                      ...and {syncResult.syncedPatients.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};