import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Use Resend API directly instead of npm module
const resendApiKey = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Security configuration
const ALLOWED_ORIGINS = (Deno.env.get('ALLOWED_ORIGINS') || 'https://come-get-it.app,http://localhost:8080').split(',');
const RATE_LIMIT_PER_EMAIL_PER_HOUR = 3;
const RATE_LIMIT_PER_IP_PER_HOUR = 10;

interface EmailRequest {
  type: 'user_signup' | 'venue_application';
  data: any;
}

// Input validation helpers
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
};

const sanitizeString = (str: string, maxLength: number = 200): string => {
  if (!str) return '';
  return str.replace(/[<>&"']/g, (match) => {
    const escapeMap: { [key: string]: string } = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#x27;'
    };
    return escapeMap[match];
  }).slice(0, maxLength);
};

const validateOrigin = (request: Request): boolean => {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  return ALLOWED_ORIGINS.some(allowed => origin === allowed || origin.endsWith('.lovableproject.com'));
};

const getClientIP = (request: Request): string => {
  return request.headers.get('x-forwarded-for')?.split(',')[0] || 
         request.headers.get('x-real-ip') || 
         'unknown';
};

const checkRateLimit = async (email: string, ip: string, type: string): Promise<boolean> => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  
  // Check email rate limit
  const { count: emailCount } = await supabase
    .from('lead_requests')
    .select('*', { count: 'exact', head: true })
    .eq('email', email)
    .gte('created_at', oneHourAgo);
  
  if (emailCount && emailCount >= RATE_LIMIT_PER_EMAIL_PER_HOUR) {
    return false;
  }
  
  // Check IP rate limit
  const { count: ipCount } = await supabase
    .from('lead_requests')
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .gte('created_at', oneHourAgo);
  
  if (ipCount && ipCount >= RATE_LIMIT_PER_IP_PER_HOUR) {
    return false;
  }
  
  return true;
};

const logRequest = async (email: string, ip: string, type: string): Promise<void> => {
  await supabase
    .from('lead_requests')
    .insert({
      email,
      ip_address: ip,
      request_type: type
    });
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Security: Origin validation
    if (!validateOrigin(req)) {
      console.log('Blocked request: invalid origin:', req.headers.get('origin'));
      return new Response(JSON.stringify({ error: "Access denied" }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { type, data }: EmailRequest = await req.json();
    const clientIP = getClientIP(req);
    
    // Input validation
    if (!data.email || !validateEmail(data.email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Rate limiting
    const rateLimitOk = await checkRateLimit(data.email, clientIP, type);
    if (!rateLimitOk) {
      console.log(`Rate limit exceeded for email: ${data.email.split('@')[0]}@***, IP: ${clientIP}`);
      return new Response(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Sanitize inputs
    const sanitizedData = {
      email: data.email.trim().toLowerCase(),
      name: sanitizeString(data.name || ''),
      phone: sanitizeString(data.phone || ''),
      venueName: sanitizeString(data.venueName || ''),
      source: sanitizeString(data.source || '')
    };

    let htmlContent = "";
    let textContent = "";
    let adminHtmlContent = "";
    let adminTextContent = "";
    let emailSubject = "";
    let adminSubject = "";

    if (type === 'user_signup') {
      const { email } = sanitizedData;
      
      emailSubject = "Isten hozott a Come Get It családban! 🎉";
      
      // User welcome email
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); color: white; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #00D4FF 0%, #00a9cc 100%); padding: 40px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px; font-weight: bold;">Üdvözlünk! 🎉</h1>
          </div>
          
          <div style="padding: 40px 30px;">
            <h2 style="color: #00D4FF; margin-top: 0;">Hurrá, megcsináltad!</h2>
            <p style="font-size: 18px; line-height: 1.6; margin: 20px 0;">
              Fantasztikus, hogy csatlakoztál hozzánk! Hamarosan elérhetővé válik az app, ahol minden nap ingyen szerezhetsz italokat és kedvezményeket.
            </p>
            
            <div style="background: rgba(0, 212, 255, 0.1); border: 1px solid rgba(0, 212, 255, 0.3); border-radius: 8px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #00D4FF; margin-top: 0;">Mit vársz tőlünk?</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li style="margin: 8px 0;">🥤 Napi ingyenes italok</li>
                <li style="margin: 8px 0;">🎯 Exkluzív kedvezmények</li>
                <li style="margin: 8px 0;">⚡ Pontgyűjtés minden vásárlásnál</li>
                <li style="margin: 8px 0;">🏆 Különleges jutalmak</li>
              </ul>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6;">
              Kövesd a fejlesztéseket és légy az első, aki megtudja, mikor indul az app!
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://come-get-it.app" style="display: inline-block; background: linear-gradient(135deg, #00D4FF 0%, #00a9cc 100%); color: #000; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: bold; font-size: 16px;">
                Látogasd meg az oldalt
              </a>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; background: rgba(255, 255, 255, 0.05); font-size: 14px; color: #aaa;">
            <p style="margin: 0;">Come Get It csapat ❤️</p>
          </div>
        </div>
      `;

      textContent = `
Üdvözlünk a Come Get It családban! 🎉

Hurrá, megcsináltad!

Fantasztikus, hogy csatlakoztál hozzánk! Hamarosan elérhetővé válik az app, ahol minden nap ingyen szerezhetsz italokat és kedvezményeket.

Mit vársz tőlünk?
🥤 Napi ingyenes italok
🎯 Exkluzív kedvezmények  
⚡ Pontgyűjtés minden vásárlásnál
🏆 Különleges jutalmak

Kövesd a fejlesztéseket és légy az első, aki megtudja, mikor indul az app!

Látogasd meg az oldalt: https://come-get-it.app

Come Get It csapat ❤️
      `;

      // Admin notification
      adminSubject = "Új feliratkozás a Come Get It várólistára";
      adminHtmlContent = `
        <h2>Új feliratkozás érkezett!</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Időpont:</strong> ${new Date().toLocaleString('hu-HU')}</p>
        <p><strong>Forrás:</strong> ${sanitizedData.source || 'Nincs megadva'}</p>
      `;
      adminTextContent = `
Új feliratkozás érkezett!

Email: ${email}
Időpont: ${new Date().toLocaleString('hu-HU')}
Forrás: ${sanitizedData.source || 'Nincs megadva'}
      `;
    } else if (type === 'venue_application') {
      const { name, email, phone, venueName } = sanitizedData;
      
      emailSubject = "Megkaptuk a jelentkezésedet! 🤝";
      
      // Venue owner confirmation email
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); color: white; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #00D4FF 0%, #00a9cc 100%); padding: 40px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px; font-weight: bold;">Köszönjük! 🤝</h1>
          </div>
          
          <div style="padding: 40px 30px;">
            <h2 style="color: #00D4FF; margin-top: 0;">Kedves ${name || 'Partnertárs'}!</h2>
            <p style="font-size: 18px; line-height: 1.6; margin: 20px 0;">
              Fantasztikus, hogy érdekel a Come Get It partneri program! Megkaptuk a jelentkezésedet, és hamarosan felvesszük veled a kapcsolatot.
            </p>
            
            <div style="background: rgba(0, 212, 255, 0.1); border: 1px solid rgba(0, 212, 255, 0.3); border-radius: 8px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #00D4FF; margin-top: 0;">Mit nyújt a partnerség?</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li style="margin: 8px 0;">📈 Több vásárló és magasabb forgalom</li>
                <li style="margin: 8px 0;">🎯 Célzott marketing kampányok</li>
                <li style="margin: 8px 0;">📱 Egyszerű digitális megoldások</li>
                <li style="margin: 8px 0;">🤝 Hosszú távú együttműködés</li>
              </ul>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6;">
              Csapatunk 1-2 munkanapon belül jelentkezni fog, hogy megbeszéljük a részleteket és elindítsuk az együttműködést.
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; background: rgba(255, 255, 255, 0.05); font-size: 14px; color: #aaa;">
            <p style="margin: 0;">Come Get It csapat ❤️</p>
          </div>
        </div>
      `;

      textContent = `
Köszönjük! 🤝

Kedves ${name || 'Partnertárs'}!

Fantasztikus, hogy érdekel a Come Get It partneri program! Megkaptuk a jelentkezésedet, és hamarosan felvesszük veled a kapcsolatot.

Mit nyújt a partnerség?
📈 Több vásárló és magasabb forgalom
🎯 Célzott marketing kampányok  
📱 Egyszerű digitális megoldások
🤝 Hosszú távú együttműködés

Csapatunk 1-2 munkanapon belül jelentkezni fog, hogy megbeszéljük a részleteket és elindítsuk az együttműködést.

Come Get It csapat ❤️
      `;

      // Admin notification
      adminSubject = "Új vendéglátóhely jelentkezés";
      adminHtmlContent = `
        <h2>Új vendéglátóhely jelentkezés érkezett!</h2>
        <p><strong>Név:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone || 'Nincs megadva'}</p>
        <p><strong>Hely neve:</strong> ${venueName}</p>
        <p><strong>Időpont:</strong> ${new Date().toLocaleString('hu-HU')}</p>
        <p><strong>Forrás:</strong> ${sanitizedData.source || 'Nincs megadva'}</p>
      `;
      adminTextContent = `
Új vendéglátóhely jelentkezés érkezett!

Név: ${name}
Email: ${email}
Telefon: ${phone || 'Nincs megadva'}
Hely neve: ${venueName}
Időpont: ${new Date().toLocaleString('hu-HU')}
Forrás: ${sanitizedData.source || 'Nincs megadva'}
      `;
    }

    // Store in database first
    try {
      if (type === 'user_signup') {
        await supabase
          .from('waitlist_signups')
          .insert({
            email: sanitizedData.email,
            source: sanitizedData.source
          });
      } else if (type === 'venue_application') {
        await supabase
          .from('venue_applications')
          .insert({
            email: sanitizedData.email,
            name: sanitizedData.name,
            phone: sanitizedData.phone,
            venue_name: sanitizedData.venueName
          });
      }
    } catch (dbError) {
      console.error("Database insert failed:", dbError);
      return new Response(JSON.stringify({ error: "Failed to process request" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Log successful request for rate limiting
    await logRequest(sanitizedData.email, clientIP, type);

    // Send the confirmation email to the user
    let emailResponse = null;
    try {
      emailResponse = await sendEmailWithRetry({
        from: "Come Get It <noreply@come-get-it.app>",
        to: [sanitizedData.email],
        subject: emailSubject,
        html: htmlContent,
        text: textContent,
      });
      console.log("User email sent successfully");
    } catch (error) {
      console.error("Failed to send user email:", error);
      // Continue execution even if user email fails
    }

    // Send notification to admin
    let adminEmailResponse = null;
    try {
      adminEmailResponse = await sendEmailWithRetry({
        from: "Come Get It <noreply@come-get-it.app>",
        to: ["hello@come-get-it.app"],
        subject: adminSubject,
        html: adminHtmlContent,
        text: adminTextContent,
        reply_to: sanitizedData.email,
      });
      console.log("Admin email sent successfully");
    } catch (error) {
      console.error("Failed to send admin email:", error);
      // Continue execution even if admin email fails
    }

    return new Response(JSON.stringify({ success: true, message: "Request processed successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in send-notification-email function:", error.message);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function sendEmailWithRetry(email: any, maxRetries = 3) {
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      const response = await resend.emails.send(email);
      console.log(`Email sent successfully on attempt ${attempt + 1}:`, response);
      return response;
    } catch (error: any) {
      if (attempt === maxRetries) {
        console.error('Email send error, no more retries:', error);
        throw error;
      }
      const base = 600; // ms
      const wait = base * Math.pow(2, attempt) + Math.floor(Math.random() * 200);
      console.log(`Email error, retrying in ${wait}ms...`);
      await delay(wait);
      attempt++;
    }
  }
}

serve(handler);