import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
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
      venueType: sanitizeString(data.venueType || ''),
      addressCity: sanitizeString(data.addressCity || ''),
      dailyCustomerCount: sanitizeString(data.dailyCustomerCount || ''),
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
        <!DOCTYPE html>
        <html lang="hu">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Üdvözlünk a Come Get It-nél!</title>
          <style>
            @media (prefers-color-scheme: dark) {
              .email-container {
                background-color: #f8f9fa !important;
              }
              .email-content {
                background-color: #ffffff !important;
                color: #1a1a1a !important;
              }
              .text-muted {
                color: #6c757d !important;
              }
            }
          </style>
        </head>
        <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; background-color: #f8f9fa; margin: 0; padding: 0;" class="email-container">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background-color: #ffffff; border: 2px solid #00D4FF; border-radius: 16px; padding: 40px; text-align: center; box-shadow: 0 4px 20px rgba(0, 212, 255, 0.1);" class="email-content">
              <div style="margin-bottom: 30px;">
                <h1 style="color: #00D4FF; font-size: 32px; font-weight: bold; margin: 0 0 10px 0;">
                  Come Get It! 🍹
                </h1>
                <div style="width: 60px; height: 4px; background: linear-gradient(90deg, #00D4FF, #00bfe6); margin: 0 auto; border-radius: 2px;"></div>
              </div>
              
              <h2 style="color: #1a1a1a; font-size: 24px; margin: 30px 0 20px 0;">
                Üdvözlünk a Come Get It közösségében! 🎉
              </h2>
              
              <p style="color: #4a5568; font-size: 18px; margin: 20px 0; line-height: 1.6;">
                Szuper, hogy csatlakoztál! Hamarosan értesítünk, amikor elindítjuk az appot és te is elkezdheted gyűjteni a pontokat minden nap ingyen italokért! 🚀
              </p>
              
              <div style="background-color: #f0f9ff; border-left: 4px solid #00D4FF; padding: 20px; margin: 30px 0; text-align: left; border-radius: 8px;">
                <h3 style="color: #00D4FF; font-size: 20px; margin: 0 0 15px 0;">
                  Mi vár rád? ✨
                </h3>
                <ul style="color: #4a5568; font-size: 16px; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 10px;">🎯 Napi pontgyűjtés egyszerű feladatokkal</li>
                  <li style="margin-bottom: 10px;">🍹 Ingyen italok a kedvenc helyeidről</li>
                  <li style="margin-bottom: 10px;">🎁 Exkluzív ajánlatok és meglepetések</li>
                  <li style="margin-bottom: 10px;">🌟 Közösségi kihívások és versenyek</li>
                </ul>
              </div>
              
              <p style="color: #4a5568; font-size: 16px; margin: 30px 0;">
                Addig is kövesd a fejlesztéseket és legyél az elsők között, akik megtudják mikor indul az app! 
              </p>
              
              <div style="margin: 30px 0;">
                <a href="https://come-get-it.app" style="display: inline-block; background: linear-gradient(135deg, #00D4FF, #00bfe6); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3); transition: all 0.3s ease;">
                  Látogasd meg a weboldalunkat
                </a>
              </div>
              
              <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
                <p style="color: #718096; font-size: 14px; margin: 0;" class="text-muted">
                  Izgalmas időszak következik! 🔥
                </p>
                <p style="color: #718096; font-size: 14px; margin: 10px 0 0 0;" class="text-muted">
                  A Come Get It csapata ❤️
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #718096; font-size: 12px; margin: 0;" class="text-muted">
                Ez az email azért érkezett, mert feliratkoztál a Come Get It várólistájára.<br>
                Ha nem szeretnél több emailt kapni, <a href="#" style="color: #00D4FF; text-decoration: none;">leiratkozhatsz itt</a>.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;

      textContent = `
Üdvözlünk a Come Get It közösségében!

Szuper, hogy csatlakoztál! Hamarosan értesítünk, amikor elindítjuk az appot és te is elkezdheted gyűjteni a pontokat minden nap ingyen italokért!

Mi vár rád?
• Napi pontgyűjtés egyszerű feladatokkal
• Ingyen italok a kedvenc helyeidről  
• Exkluzív ajánlatok és meglepetések
• Közösségi kihívások és versenyek

Addig is kövesd a fejlesztéseket: https://come-get-it.app

Izgalmas időszak következik!
A Come Get It csapata
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
      const { name, email, phone, venueName, venueType, addressCity, dailyCustomerCount } = sanitizedData;
      
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

      // Admin notification with table format
      adminSubject = "Új vendéglátóhely jelentkezés";
      adminHtmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #00D4FF 0%, #00a9cc 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
            th { background: #00D4FF; color: white; padding: 12px; text-align: left; font-weight: bold; }
            td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
            tr:last-child td { border-bottom: none; }
            .label { font-weight: bold; color: #555; width: 40%; }
            .value { color: #333; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">🏪 Új vendéglátóhely jelentkezés</h2>
            </div>
            <div class="content">
              <p>Új partneri jelentkezés érkezett a rendszerbe!</p>
              
              <table>
                <tr>
                  <th colspan="2">Kapcsolattartó adatok</th>
                </tr>
                <tr>
                  <td class="label">Név:</td>
                  <td class="value">${name}</td>
                </tr>
                <tr>
                  <td class="label">Email:</td>
                  <td class="value"><a href="mailto:${email}">${email}</a></td>
                </tr>
                <tr>
                  <td class="label">Telefon:</td>
                  <td class="value">${phone || 'Nincs megadva'}</td>
                </tr>
              </table>

              <table>
                <tr>
                  <th colspan="2">Helység adatok</th>
                </tr>
                <tr>
                  <td class="label">Helység neve:</td>
                  <td class="value">${venueName}</td>
                </tr>
                <tr>
                  <td class="label">Típus:</td>
                  <td class="value">${venueType || 'Nincs megadva'}</td>
                </tr>
                <tr>
                  <td class="label">Város:</td>
                  <td class="value">${addressCity || 'Nincs megadva'}</td>
                </tr>
                <tr>
                  <td class="label">Napi vendégszám:</td>
                  <td class="value">${dailyCustomerCount || 'Nincs megadva'}</td>
                </tr>
              </table>

              <table>
                <tr>
                  <th colspan="2">Egyéb információk</th>
                </tr>
                <tr>
                  <td class="label">Időpont:</td>
                  <td class="value">${new Date().toLocaleString('hu-HU')}</td>
                </tr>
                <tr>
                  <td class="label">Forrás:</td>
                  <td class="value">${sanitizedData.source || 'Nincs megadva'}</td>
                </tr>
              </table>
              
              <p style="margin-top: 20px; color: #666; font-size: 14px;">
                ⏰ Érdemes minél hamarabb felvenni a kapcsolatot a jelentkezővel!
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
      adminTextContent = `
Új vendéglátóhely jelentkezés érkezett!

KAPCSOLATTARTÓ ADATOK:
Név: ${name}
Email: ${email}
Telefon: ${phone || 'Nincs megadva'}

HELYSÉG ADATOK:
Helység neve: ${venueName}
Típus: ${venueType || 'Nincs megadva'}
Város: ${addressCity || 'Nincs megadva'}
Napi vendégszám: ${dailyCustomerCount || 'Nincs megadva'}

EGYÉB INFORMÁCIÓK:
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
            venue_name: sanitizedData.venueName,
            venue_type: sanitizedData.venueType,
            address_city: sanitizedData.addressCity,
            daily_customer_count: sanitizedData.dailyCustomerCount
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
    let userEmailSent = false;
    let adminEmailSent = false;
    
    try {
      console.log(`Attempting to send welcome email to: ${sanitizedData.email}`);
      emailResponse = await sendEmailWithRetry({
        from: "Come Get It <noreply@come-get-it.app>",
        to: [sanitizedData.email],
        subject: emailSubject,
        html: htmlContent,
        text: textContent,
      });
      userEmailSent = true;
      console.log("✅ User welcome email sent successfully:", emailResponse.id);
    } catch (error) {
      console.error("❌ Failed to send user welcome email:", error);
      console.error("Email details:", { 
        to: sanitizedData.email, 
        subject: emailSubject,
        error: error instanceof Error ? error.message : String(error)
      });
    }

    // Send notification to admin
    let adminEmailResponse = null;
    try {
      console.log("Attempting to send admin notification email");
      adminEmailResponse = await sendEmailWithRetry({
        from: "Come Get It <noreply@come-get-it.app>",
        to: ["gataibence@gmail.com"],
        subject: adminSubject,
        html: adminHtmlContent,
        text: adminTextContent,
        reply_to: sanitizedData.email,
      });
      adminEmailSent = true;
      console.log("✅ Admin notification email sent successfully:", adminEmailResponse.id);
    } catch (error) {
      console.error("❌ Failed to send admin notification email:", error);
      console.error("Admin email details:", { 
        to: "hello@come-get-it.app", 
        subject: adminSubject,
        error: error instanceof Error ? error.message : String(error)
      });
    }

    // Log final email delivery status
    console.log(`📧 Email delivery summary - Welcome: ${userEmailSent ? '✅' : '❌'}, Admin: ${adminEmailSent ? '✅' : '❌'}`);

    // Return success with email delivery status
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Request processed successfully",
      email_status: {
        welcome_email_sent: userEmailSent,
        admin_email_sent: adminEmailSent
      }
    }), {
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
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(email),
      });

      if (!response.ok) {
        throw new Error(`Resend API error: ${response.status}`);
      }

      const result = await response.json();
      console.log(`Email sent successfully on attempt ${attempt + 1}:`, result);
      return result;
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