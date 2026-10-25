// Welcome e-mail for waitlist signups, in the Come Get It look:
// near-black background, cyan accent, condensed uppercase headlines.
// Table layout + inline styles so it renders the same in Gmail, Apple Mail and Outlook.

const SITE = "https://come-get-it.app";
const LOGO = `${SITE}/email/cg-logo-192.png`;
const INSTAGRAM = "https://www.instagram.com/come.get.it.app/";
const UNSUBSCRIBE = "mailto:gataibence@gmail.com?subject=Leiratkoz%C3%A1si%20k%C3%A9r%C3%A9s";
const SHARE_TEXT = encodeURIComponent("Napi egy ingyen ital budapesti helyeken. Iratkozz fel te is: https://come-get-it.app/?utm_source=share&utm_medium=email&utm_campaign=welcome");

const CYAN = "#00C8E0";
const BG = "#050505";
const CARD = "#0B0F12";
const LINE = "#16343A";
const TEXT = "#E8F4F6";
const MUTED = "#8A9CA1";
const HEAD = "Anton, Impact, 'Arial Narrow Bold', 'Helvetica Neue Condensed Bold', Arial, sans-serif";
const BODY = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export const welcomeSubject = "Bent vagy. Szólunk, amikor indul a Come Get It.";

const step = (n: string, title: string, body: string) => `
  <tr>
    <td valign="top" width="44" style="padding:0 0 18px 0;">
      <div style="width:32px;height:32px;line-height:32px;border-radius:16px;border:1px solid ${CYAN};color:${CYAN};font-family:${HEAD};font-size:16px;text-align:center;">${n}</div>
    </td>
    <td valign="top" style="padding:2px 0 18px 0;font-family:${BODY};">
      <div style="color:${TEXT};font-size:16px;font-weight:700;line-height:22px;">${title}</div>
      <div style="color:${MUTED};font-size:14px;line-height:21px;">${body}</div>
    </td>
  </tr>`;

export const welcomeHtml = `<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>Bent vagy – Come Get It</title>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;700&display=swap" rel="stylesheet">
  <style>
    @media (max-width: 520px) {
      .px { padding-left: 22px !important; padding-right: 22px !important; }
      .h1 { font-size: 40px !important; line-height: 42px !important; }
    }
    a { color: ${CYAN}; }
  </style>
</head>
<body style="margin:0;padding:0;background:${BG};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${BG};">Elsőként szólunk, amikor indul az app. Addig is: így működik a napi ingyen ital.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BG};">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

          <tr>
            <td align="left" style="padding:0 4px 20px 4px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                <td valign="middle"><img src="${LOGO}" width="44" height="44" alt="Come Get It" style="display:block;border:0;border-radius:10px;"></td>
                <td valign="middle" style="padding-left:12px;font-family:${HEAD};font-size:20px;letter-spacing:1px;color:${TEXT};text-transform:uppercase;">Come Get It</td>
              </tr></table>
            </td>
          </tr>

          <tr>
            <td style="background:${CARD};border:1px solid ${LINE};border-radius:20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="height:4px;background:${CYAN};border-radius:20px 20px 0 0;font-size:0;line-height:0;">&nbsp;</td></tr>
                <tr>
                  <td class="px" style="padding:36px 40px 8px 40px;">
                    <div style="font-family:${BODY};font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${CYAN};">Budapest · feliratkozás megerősítve</div>
                    <div class="h1" style="font-family:${HEAD};font-size:48px;line-height:50px;text-transform:uppercase;color:${TEXT};margin:14px 0 0 0;">Bent vagy.</div>
                    <div class="h1" style="font-family:${HEAD};font-size:48px;line-height:50px;text-transform:uppercase;color:${CYAN};margin:0;">Napi egy ingyen ital vár.</div>
                    <p style="font-family:${BODY};font-size:16px;line-height:25px;color:${TEXT};opacity:.85;margin:20px 0 0 0;">
                      Köszi, hogy feliratkoztál! Elsőként szólunk, amikor a Come Get It nyilvánosan elindul Budapesten. Csak az indulásról írunk, spam nincs.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td class="px" style="padding:28px 40px 6px 40px;">
                    <div style="font-family:${HEAD};font-size:20px;letter-spacing:1px;text-transform:uppercase;color:${TEXT};margin:0 0 16px 0;">Így működik</div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      ${step("1", "Nézd meg a térképen", "Látod, melyik közeli partnerhelyen mi érhető el most.")}
                      ${step("2", "Menj el a kiválasztott helyre", "Te döntöd el, hol iszod meg a napi ingyen italod.")}
                      ${step("3", "Mutasd meg a QR-kódot a pultnál", "A pultos beolvassa, és már hozza is. Egészségedre!")}
                    </table>
                  </td>
                </tr>

                <tr>
                  <td class="px" align="left" style="padding:8px 40px 36px 40px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                      <td style="border-radius:999px;background:${CYAN};">
                        <a href="mailto:?subject=Come%20Get%20It&body=${SHARE_TEXT}" style="display:inline-block;padding:15px 28px;font-family:${BODY};font-size:16px;font-weight:700;color:#001417;text-decoration:none;border-radius:999px;">Küldd el egy barátodnak</a>
                      </td>
                    </tr></table>
                    <p style="font-family:${BODY};font-size:14px;line-height:21px;color:${MUTED};margin:16px 0 0 0;">
                      Kivel mennél el elsőként? Ha ő is feliratkozik, együtt kezdhetitek.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:24px 16px 0 16px;font-family:${BODY};font-size:12px;line-height:19px;color:${MUTED};">
              <a href="${SITE}/?utm_source=email&amp;utm_medium=email&amp;utm_campaign=welcome" style="color:${CYAN};text-decoration:none;">come-get-it.app</a>
              &nbsp;·&nbsp;
              <a href="${INSTAGRAM}" style="color:${CYAN};text-decoration:none;">Instagram</a>
              <br>
              18+ · Fogyassz felelősséggel. A kínálat helyenként és naponta változhat.
              <br>
              Azért kaptad, mert feliratkoztál a Come Get It értesítőjére.
              <a href="${UNSUBSCRIBE}" style="color:${MUTED};text-decoration:underline;">Leiratkozás</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export const welcomeText = `BENT VAGY. NAPI EGY INGYEN ITAL VÁR.

Köszi, hogy feliratkoztál! Elsőként szólunk, amikor a Come Get It nyilvánosan elindul Budapesten. Csak az indulásról írunk, spam nincs.

ÍGY MŰKÖDIK
1. Nézd meg a térképen, melyik közeli partnerhelyen mi érhető el most.
2. Menj el a kiválasztott helyre.
3. Mutasd meg a QR-kódot a pultnál. Egészségedre!

Küldd el egy barátodnak: ${SITE}/?utm_source=share&utm_medium=email&utm_campaign=welcome

18+ · Fogyassz felelősséggel. A kínálat helyenként és naponta változhat.
Leiratkozás: írj a gataibence@gmail.com címre „Leiratkozási kérés” tárggyal.
`;
