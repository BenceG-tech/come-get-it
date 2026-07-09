const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FPS = 30;
const DURATION = 19;
const TOTAL_FRAMES = FPS * DURATION;
const FRAMES_DIR = path.join(__dirname, 'frames');

(async () => {
  if (!fs.existsSync(FRAMES_DIR)) fs.mkdirSync(FRAMES_DIR);

  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.join(__dirname, 'index.html'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);

  const startTime = Date.now();
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const t = i / FPS;
    await page.evaluate((tt) => window.__setTime(tt), t);
    const frameName = `frame_${String(i).padStart(5, '0')}.png`;
    await page.screenshot({ path: path.join(FRAMES_DIR, frameName) });
    if (i % 30 === 0) console.log(`frame ${i}/${TOTAL_FRAMES}`);
  }
  console.log(`Rendered ${TOTAL_FRAMES} frames in ${(Date.now()-startTime)/1000}s`);
  await browser.close();
})();
