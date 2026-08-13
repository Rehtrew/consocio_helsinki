import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const OUT = "/tmp/shots";
mkdirSync(OUT, { recursive: true });
const [, , widthArg, tag = "d", schemeArg = "light"] = process.argv;
const width = Number(widthArg ?? 1280);

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const page = await browser.newPage({
  viewport: { width, height: 1000 },
  deviceScaleFactor: 2,
  colorScheme: schemeArg,
});
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

// Walk the page so every IntersectionObserver fires, then come back up.
const h = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < h; y += 700) {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(120);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(700);

const shots = {
  hero: 0,
  program: "#torsdag",
  fredag: "#fredag",
  lordag: "#lordag",
  sondag: "#sondag",
  kort: "#kort",
  budget: "#budget",
  praktisk: "#praktisk",
};

for (const [name, target] of Object.entries(shots)) {
  if (typeof target === "number") {
    await page.evaluate((v) => window.scrollTo(0, v), target);
  } else {
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 80);
    }, target);
  }
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/${tag}-${name}.png` });
}

await browser.close();
console.log("done", tag, width, schemeArg);
