import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TransactionRequest {
  order_id: string;
  gross_amount: number;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  item_details: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

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

    const body: TransactionRequest = await req.json();
    
    // Validate required fields
    if (!body.order_id || !body.gross_amount || !body.customer_name || !body.customer_phone) {
      throw new Error('Missing required fields: order_id, gross_amount, customer_name, customer_phone');
    }

    // Prepare Midtrans transaction payload
    const transactionPayload = {
      transaction_details: {
        order_id: body.order_id,
        gross_amount: body.gross_amount,
      },
      customer_details: {
        first_name: body.customer_name,
        email: body.customer_email || '',
        phone: body.customer_phone,
      },
      item_details: body.item_details || [
        {
          id: 'TICKET',
          name: 'Tiket Travel',
          price: body.gross_amount,
          quantity: 1,
        }
      ],
      callbacks: {
        finish: `${req.headers.get('origin')}/booking?status=finish`,
        error: `${req.headers.get('origin')}/booking?status=error`,
        pending: `${req.headers.get('origin')}/booking?status=pending`,
      }
    };

    // Determine API URL based on server key (sandbox vs production)
    const isSandbox = serverKey.startsWith('SB-');
    const apiUrl = isSandbox 
      ? 'https://app.sandbox.midtrans.com/snap/v1/transactions'
      : 'https://app.midtrans.com/snap/v1/transactions';

    // Create Base64 encoded auth
    const authString = btoa(`${serverKey}:`);

    console.log('Creating Midtrans transaction:', {
      order_id: body.order_id,
      gross_amount: body.gross_amount,
      isSandbox,
    });

    // Call Midtrans Snap API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${authString}`,
      },
      body: JSON.stringify(transactionPayload),
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('Midtrans API error:', responseText);
      throw new Error(`Midtrans API error: ${responseText}`);
    }

    const data = JSON.parse(responseText);
    
    console.log('Midtrans transaction created:', {
      token: data.token ? 'exists' : 'missing',
      redirect_url: data.redirect_url ? 'exists' : 'missing',
    });

    return new Response(JSON.stringify({
      success: true,
      token: data.token,
      redirect_url: data.redirect_url,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error creating Midtrans transaction:', error);
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
