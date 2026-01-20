import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const serverKey = Deno.env.get('MIDTRANS_SERVER_KEY');
    
    if (!serverKey) {
      throw new Error('MIDTRANS_SERVER_KEY is not configured');
    }

    const { order_id } = await req.json();
    
    if (!order_id) {
      throw new Error('order_id is required');
    }

    // Determine API URL based on server key (sandbox vs production)
    const isSandbox = serverKey.startsWith('SB-');
    const apiUrl = isSandbox 
      ? `https://api.sandbox.midtrans.com/v2/${order_id}/status`
      : `https://api.midtrans.com/v2/${order_id}/status`;

    // Create Base64 encoded auth
    const authString = btoa(`${serverKey}:`);

    console.log('Checking Midtrans status for:', order_id);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${authString}`,
      },
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('Midtrans API error:', responseText);
      // Return pending status if transaction not found
      if (response.status === 404) {
        return new Response(JSON.stringify({
          success: true,
          transaction_status: 'pending',
          order_id,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`Midtrans API error: ${responseText}`);
    }

    const data = JSON.parse(responseText);
    
    console.log('Midtrans status response:', {
      order_id: data.order_id,
      transaction_status: data.transaction_status,
      fraud_status: data.fraud_status,
    });

    return new Response(JSON.stringify({
      success: true,
      ...data,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error checking Midtrans status:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
