import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const canvasId = Deno.env.get('CANVAS_ID');
    const canvasSecret = Deno.env.get('CANVAS_SECRET');

    if (!canvasId || !canvasSecret) {
      throw new Error('Canvas credentials not configured');
    }

    const { code, state } = await req.json();
    
    if (!code) {
      // Return authorization URL for initial OAuth flow
      const authUrl = new URL('https://secure.canvasmedical.com/oauth/authorize');
      authUrl.searchParams.set('client_id', canvasId);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', 'read write');
      authUrl.searchParams.set('redirect_uri', `${req.headers.get('origin')}/canvas-callback`);
      authUrl.searchParams.set('state', state || 'default');

      return new Response(
        JSON.stringify({ authUrl: authUrl.toString() }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://secure.canvasmedical.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: canvasId,
        client_secret: canvasSecret,
        code: code,
        redirect_uri: `${req.headers.get('origin')}/canvas-callback`
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Canvas token exchange failed:', errorText);
      throw new Error(`Token exchange failed: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    
    console.log('Canvas OAuth successful');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresIn: tokenData.expires_in
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in canvas-auth:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});