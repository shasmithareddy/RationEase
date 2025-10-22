import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Token {
  token_number: number;
  customer_name: string;
  customer_phone: string;
}

interface RequestBody {
  tokens: Token[];
  shopName: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      throw new Error("Twilio credentials not configured");
    }

    const { tokens, shopName }: RequestBody = await req.json();

    console.log(`Sending SMS notifications for ${tokens.length} tokens`);

    // Send SMS to each customer
    const smsPromises = tokens.map(async (token) => {
      const message = `RationQueue Alert: Token #${token.token_number} - ${token.customer_name}, your turn is approaching at ${shopName}. Please arrive within 10-15 minutes. / உங்கள் முறை நெருங்குகிறது, தயவுசெய்து 10-15 நிமிடங்களில் வாருங்கள்.`;

      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
      
      const formData = new URLSearchParams({
        To: token.customer_phone,
        From: TWILIO_PHONE_NUMBER,
        Body: message,
      });

      const response = await fetch(twilioUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`Failed to send SMS to ${token.customer_phone}:`, error);
        throw new Error(`Twilio API error: ${error}`);
      }

      const result = await response.json();
      console.log(`SMS sent to ${token.customer_phone}:`, result.sid);
      return result;
    });

    const results = await Promise.all(smsPromises);

    return new Response(
      JSON.stringify({
        success: true,
        count: results.length,
        message: "SMS notifications sent successfully",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-sms-notifications function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
