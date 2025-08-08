
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  type: 'user_signup' | 'venue_application';
  data: {
    email: string;
    name?: string;
    phone?: string;
    venueName?: string;
    timestamp?: string;
    source?: string;
  };
}

serve(async (req) => {
  console.log('Edge function called:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestBody = await req.json();
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const { type, data }: EmailRequest = requestBody;
    
    if (!type || !data) {
      throw new Error('Missing required fields: type and data');
    }

    if (!data.email) {
      throw new Error('Email is required in data object');
    }

    // Email küldés a Resend API-val
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY environment variable not found');
      throw new Error('Email service not configured');
    }

    console.log('Processing email for type:', type, 'email:', data.email);

    let emails = [];

    if (type === 'user_signup') {
      // Értesítő email gataibence@gmail.com-ra
      emails.push({
        from: 'Come Get It <noreply@come-get-it.app>',
        to: ['gataibence@gmail.com'],
        reply_to: data.email,
        subject: `Új előregisztráció: ${data.email}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0f384e;">Új előregisztráció</h2>
            <p><strong>E-mail:</strong> ${data.email}</p>
            <p><strong>Név (opcionális):</strong> ${data.name || '—'}</p>
            <p><strong>Időbélyeg:</strong> ${data.timestamp || new Date().toLocaleString('hu-HU')}</p>
            <p><strong>Forrás:</strong> ${data.source || '—'}</p>
          </div>
        `
      });

      // Köszönő email a felhasználónak
      emails.push({
        from: 'Come Get It <noreply@come-get-it.app>',
        to: [data.email],
        subject: 'Üdv a körben! 🍻 Az első kör hamarosan a tiéd',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #111;">
            <h1 style="text-align: center;">Üdv a Come Get It alapítói körében! 🎉</h1>
            <p style="font-size:16px;">
              ${data.name ? `Szia ${data.name},` : 'Szia!'}<br/>
              Hamarosan érkezik az értesítés az első helyekről és jutalmakról.
            </p>
            <p style="font-size:16px;">Tedd félre az este első sztoriját — a kör tőlünk, a folytatás tőled.</p>
            <p style="margin-top:24px; font-size:14px; color:#555;">Üdv,<br/>a Come Get It csapat</p>
          </div>
        `
      });
    }

    if (type === 'venue_application') {
      // Értesítő email gataibence@gmail.com-ra
      emails.push({
        from: 'Come Get It <noreply@come-get-it.app>',
        to: ['gataibence@gmail.com'],
        reply_to: data.email,
        subject: `Új partner lead: ${data.venueName || 'Ismeretlen hely'} – ${data.name || 'Ismeretlen kapcsolattartó'} – ${data.phone || 'Nincs telefon'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0f384e;">Új partner jelentkezés</h2>
            <p><strong>Hely neve:</strong> ${data.venueName || '—'}</p>
            <p><strong>Kapcsolattartó:</strong> ${data.name || '—'}</p>
            <p><strong>E-mail:</strong> ${data.email}</p>
            <p><strong>Telefon:</strong> ${data.phone || '—'}</p>
            <p><strong>Időbélyeg:</strong> ${data.timestamp || new Date().toLocaleString('hu-HU')}</p>
          </div>
        `
      });

      // Köszönő email a partnernek
      emails.push({
        from: 'Come Get It <noreply@come-get-it.app>',
        to: [data.email],
        subject: 'Köszönjük, hogy jelentkeztetek! 🍸',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #111;">
            <h1 style="text-align: center;">Köszönjük a partner jelentkezést!</h1>
            <p style="font-size:16px;">Hamarosan felvesszük a kapcsolatot a következő lépésekkel (terheléscsúcsok, csomagok, riportok, onboarding).</p>
            <p style="margin-top:24px; font-size:14px; color:#555;">Come Get It Business Team</p>
          </div>
        `
      });
    }

    if (emails.length === 0) {
      console.error('No emails to send for type:', type);
      throw new Error(`Unsupported email type: ${type}`);
    }

    console.log(`Sending ${emails.length} emails...`);

    // Email küldés
    for (const email of emails) {
      console.log(`Sending email to: ${email.to.join(', ')}`);
      
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(email),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Email sending failed:', errorText);
        throw new Error(`Failed to send email: ${errorText}`);
      }

      const result = await response.json();
      console.log('Email sent successfully:', result);
    }

    console.log('All emails sent successfully');

    return new Response(
      JSON.stringify({ success: true, message: 'Emails sent successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in send-notification-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error occurred',
        details: error.stack 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
