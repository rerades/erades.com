import { chromium } from "@playwright/test";
const url = "http://host.docker.internal:4321/es/tags";
const runs = [];
for (let i = 0; i < 3; i++) {
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1350, height: 940 } });
  await page.addInitScript(() => {
    window.__c = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__c += e.value; })
      .observe({ type: "layout-shift", buffered: true });
  });
  if (process.env.BLOCK === "fonts") await page.route("**/fonts/**", (r) => r.abort());
  if (process.env.BLOCK === "img") await page.route("**/*.{png,jpg,jpeg,webp,avif,svg}", (r) => r.abort());
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  runs.push(await page.evaluate(() => window.__c));
  await browser.close();
}
runs.sort((a, b) => a - b);
console.log("CLS runs:", runs.map(r => r.toFixed(4)).join("  "), "| mediana:", runs[1].toFixed(4));
