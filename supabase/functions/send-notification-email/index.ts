
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
  // Optional flags to control which emails are sent
  sendWelcome?: boolean; // default true
  notifyAdmin?: boolean; // default true
}

serve(async (req) => {
  console.log('Edge function called:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestBody: EmailRequest = await req.json();
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const { type, data, sendWelcome = true, notifyAdmin = true } = requestBody;
    
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
      const preheader = 'Köszönjük a regisztrációt. Hamarosan küldjük a következő lépéseket.';
      const greetingName = data.name ? `Szia ${data.name},` : 'Szia!';
      const welcomeHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #111;">
            <span style="display:none; visibility:hidden; opacity:0; color:transparent; height:0; width:0; overflow:hidden;">${preheader}</span>
            <h1 style="text-align: center;">Üdv a Come Get It alapítói körében! 🎉</h1>
            <p style="font-size:16px;">${greetingName}<br/>
              Sikeres előregisztráció! Hamarosan értesítünk az indulásról és az első jutalmakról.
            </p>
            <p style="font-size:16px;">Tedd félre az este első sztoriját — a kör tőlünk, a folytatás tőled.</p>
            <p style="margin-top:24px; font-size:14px; color:#555;">Üdv,<br/>a Come Get It csapat</p>
          </div>
        `;
      const welcomeText = `${data.name ? `Szia ${data.name},` : 'Szia!'}\n\nSikeres előregisztráció a Come Get It várólistájára. Hamarosan értesítünk az indulásról és az első jutalmakról.\n\nÜdv,\nCome Get It csapat`;

      if (sendWelcome) {
        emails.push({
          from: 'Come Get It <noreply@come-get-it.app>',
          to: [data.email],
          subject: 'Sikeres előregisztráció – Üdv a Come Get It-nél',
          html: welcomeHtml,
          text: welcomeText,
          headers: {
            'List-Unsubscribe': '<mailto:hello@come-get-it.app?subject=Leiratkozás>'
          }
        });
      }

      if (notifyAdmin) {
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
      }
    }

    if (type === 'venue_application') {
      const preheader = 'Köszönjük a jelentkezést. Hamarosan felvesszük a kapcsolatot.';
      const thanksHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #111;">
            <span style="display:none; visibility:hidden; opacity:0; color:transparent; height:0; width:0; overflow:hidden;">${preheader}</span>
            <h1 style="text-align: center;">Köszönjük a partner jelentkezést!</h1>
            <p style="font-size:16px;">Hamarosan felvesszük a kapcsolatot a következő lépésekkel (terheléscsúcsok, csomagok, riportok, onboarding).</p>
            <p style="margin-top:24px; font-size:14px; color:#555;">Come Get It Business Team</p>
          </div>
        `;
      const thanksText = 'Köszönjük a jelentkezést! Hamarosan felvesszük a kapcsolatot a következő lépésekkel.\n\nCome Get It Business Team';

      if (sendWelcome) {
        emails.push({
          from: 'Come Get It <noreply@come-get-it.app>',
          to: [data.email],
          subject: 'Köszönjük a jelentkezést – Come Get It Business',
          html: thanksHtml,
          text: thanksText,
          headers: {
            'List-Unsubscribe': '<mailto:hello@come-get-it.app?subject=Leiratkozás>'
          }
        });
      }

      if (notifyAdmin) {
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
              <p><strong>Forrás:</strong> ${data.source || '—'}</p>
            </div>
          `
        });
      }
    }

    if (emails.length === 0) {
      console.error('No emails to send for type:', type);
      throw new Error(`Unsupported email type: ${type}`);
    }

    console.log(`Preparing to send ${emails.length} emails...`);

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    async function sendEmailWithRetry(email: any, maxRetries = 3) {
      let attempt = 0;
      while (attempt <= maxRetries) {
        try {
          const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(email),
          });

          if (response.ok) {
            const result = await response.json();
            console.log(`Email sent successfully on attempt ${attempt + 1}:`, result);
            return result;
          }

          const status = response.status;
          const errorText = await response.text();
          console.warn(`Email send failed (status ${status}) on attempt ${attempt + 1}: ${errorText}`);

          // Retry on rate limit or server errors
          if (status === 429 || status >= 500) {
            if (attempt === maxRetries) {
              throw new Error(`Failed after ${maxRetries + 1} attempts: ${errorText}`);
            }
            const base = 600; // ms
            const wait = base * Math.pow(2, attempt) + Math.floor(Math.random() * 200);
            console.log(`Retrying in ${wait}ms...`);
            await delay(wait);
            attempt++;
            continue;
          }

          // Non-retryable error
          throw new Error(`Failed to send email: ${errorText}`);
        } catch (err) {
          if (attempt === maxRetries) {
            console.error('Email send error, no more retries:', err);
            throw err;
          }
          const base = 600; // ms
          const wait = base * Math.pow(2, attempt) + Math.floor(Math.random() * 200);
          console.log(`Network/unknown error, retrying in ${wait}ms...`);
          await delay(wait);
          attempt++;
        }
      }
    }

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      console.log(`[${i + 1}/${emails.length}] Sending email to: ${email.to.join(', ')}`);
      await sendEmailWithRetry(email, 3);
      if (i < emails.length - 1) {
        const gap = 800; // Respect Resend 2 req/sec rate limit
        console.log(`Waiting ${gap}ms before next email to respect Resend rate limits...`);
        await delay(gap);
      }
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
