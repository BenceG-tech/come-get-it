
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
        from: 'Come Get It <noreply@comegetit.hu>',
        to: ['gataibence@gmail.com'],
        subject: '🎉 Új felhasználó regisztráció - Come Get It',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0f384e;">Új felhasználó regisztráció</h2>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Regisztráció időpontja:</strong> ${data.timestamp || new Date().toLocaleString('hu-HU')}</p>
            <p><strong>Forrás:</strong> ${data.source || 'main_signup_form'}</p>
            <p>A felhasználó csatlakozott az első 1000 tag közé!</p>
          </div>
        `
      });

      // Köszönő email a felhasználónak
      emails.push({
        from: 'Come Get It <noreply@comegetit.hu>',
        to: [data.email],
        subject: '🎉 Köszönjük a regisztrációt! - Come Get It',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f384e, #27dddf); color: white; padding: 20px; border-radius: 10px;">
            <h1 style="text-align: center; margin-bottom: 30px;">Üdvözlünk a Come Get It közösségében! 🎉</h1>
            
            <p style="font-size: 18px; text-align: center; margin-bottom: 30px;">
              Gratulálunk! Sikeresen csatlakoztál az első 1000 tag közé!
            </p>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #27dddf;">🌟 Exkluzív előnyeid:</h2>
              <ul style="font-size: 16px; line-height: 1.8;">
                <li>✨ <strong>Korai hozzáférés</strong> az alkalmazáshoz - Te leszel az első, aki kipróbálhatja!</li>
                <li>🎯 <strong>Launch bónusz pontok</strong> - Extra pontokkal indítasz</li>
                <li>🏆 <strong>VIP státusz</strong> - Különleges státusz az első 1000 tag között</li>
                <li>🎁 <strong>Exkluzív ajánlatok</strong> - Csak neked szóló kedvezmények</li>
                <li>💎 <strong>Dupla pontok</strong> az első vásárlásaidra</li>
                <li>🚀 <strong>Elsőbbség</strong> az új funkciók kipróbálásában</li>
              </ul>
            </div>
            
            <p style="text-align: center; font-size: 16px; margin-top: 30px;">
              Hamarosan jelentkezünk az indulással kapcsolatos részletekkel!<br>
              Addig is kövesd a fejlesztéseket! 📱
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="font-size: 14px; opacity: 0.8;">
                Come Get It Team<br>
                🍹 Igyál ingyen • 🔗 Csatlakozz • 💰 Gyűjts pontokat
              </p>
            </div>
          </div>
        `
      });
    }

    if (type === 'venue_application') {
      // Értesítő email gataibence@gmail.com-ra
      emails.push({
        from: 'Come Get It <noreply@comegetit.hu>',
        to: ['gataibence@gmail.com'],
        subject: '🏪 Új partner jelentkezés - Come Get It',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0f384e;">Új partner jelentkezés</h2>
            <p><strong>Név:</strong> ${data.name || 'Nincs megadva'}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Telefon:</strong> ${data.phone || 'Nincs megadva'}</p>
            <p><strong>Üzlet neve:</strong> ${data.venueName || 'Nincs megadva'}</p>
            <p><strong>Jelentkezés időpontja:</strong> ${data.timestamp || new Date().toLocaleString('hu-HU')}</p>
          </div>
        `
      });

      // Köszönő email a partnernek
      emails.push({
        from: 'Come Get It <noreply@comegetit.hu>',
        to: [data.email],
        subject: '🤝 Köszönjük a partner jelentkezést! - Come Get It',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f384e, #27dddf); color: white; padding: 20px; border-radius: 10px;">
            <h1 style="text-align: center; margin-bottom: 30px;">Köszönjük a jelentkezést! 🤝</h1>
            
            <p style="font-size: 18px; text-align: center; margin-bottom: 30px;">
              Kedves ${data.name || 'Érdeklődő'}!<br>
              Örülünk, hogy csatlakozni szeretnél partnereink közé!
            </p>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #27dddf;">🚀 Partnerség előnyei:</h2>
              <ul style="font-size: 16px; line-height: 1.8;">
                <li>🎯 <strong>Ingyenes promóció</strong> - Térítésmentesen reklámozzuk üzleted</li>
                <li>📈 <strong>Növekvő vendégforgalom</strong> - Új vendégeket hozunk neked</li>
                <li>👥 <strong>Hűséges vendégkör</strong> - Építsd fel törzsvásárlóid bázisát</li>
                <li>📊 <strong>Mérhető eredmények</strong> - Részletes statisztikák és jelentések</li>
                <li>💰 <strong>Több bevétel</strong> - Növeld az árbevételed</li>
                <li>🌟 <strong>Márkaépítés</strong> - Erősítsd a helyed hírnevét</li>
              </ul>
            </div>
            
            <div style="background: rgba(39, 221, 223, 0.2); padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="font-size: 16px; text-align: center; margin: 0;">
                <strong>📋 Következő lépések:</strong><br>
                Kollégánk hamarosan felveszi Önnel a kapcsolatot<br>
                a partnerség részleteinek egyeztetése érdekében.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="font-size: 14px; opacity: 0.8;">
                Come Get It Business Team<br>
                🏪 Partnerség • 📈 Növekedés • 💼 Siker
              </p>
            </div>
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
