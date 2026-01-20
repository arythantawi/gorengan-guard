import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Midtrans transaction status mapping
const STATUS_MAP: Record<string, string> = {
  'capture': 'paid',
  'settlement': 'paid',
  'pending': 'waiting_verification',
  'deny': 'cancelled',
  'cancel': 'cancelled',
  'expire': 'cancelled',
  'failure': 'cancelled',
  'refund': 'refunded',
  'partial_refund': 'refunded',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const serverKey = Deno.env.get('MIDTRANS_SERVER_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const notification = await req.json();
    
    console.log('Midtrans webhook received:', {
      order_id: notification.order_id,
      transaction_status: notification.transaction_status,
      fraud_status: notification.fraud_status,
    });

    // Verify signature
    const { order_id, status_code, gross_amount, signature_key } = notification;
    
    // Create signature verification
    const crypto = await import("https://deno.land/std@0.168.0/crypto/mod.ts");
    const encoder = new TextEncoder();
    const data = encoder.encode(`${order_id}${status_code}${gross_amount}${serverKey}`);
    const hashBuffer = await crypto.crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const calculatedSignature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    if (calculatedSignature !== signature_key) {
      console.error('Invalid signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get transaction status
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    // Determine payment status
    let paymentStatus = STATUS_MAP[transactionStatus] || 'pending';
    
    // Handle fraud status for capture
    if (transactionStatus === 'capture' && fraudStatus === 'challenge') {
      paymentStatus = 'waiting_verification';
    }

    console.log('Updating booking status:', {
      order_id,
      old_status: transactionStatus,
      new_status: paymentStatus,
    });

    // Update booking status in database
    const { data: updateResult, error: updateError } = await supabase
      .from('bookings')
      .update({
        payment_status: paymentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('order_id', order_id)
      .select();

    if (updateError) {
      console.error('Error updating booking:', updateError);
      throw updateError;
    }

    console.log('Booking updated successfully:', updateResult);

    return new Response(JSON.stringify({
      success: true,
      order_id,
      status: paymentStatus,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
