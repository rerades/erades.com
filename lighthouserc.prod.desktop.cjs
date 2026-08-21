// Mismas URLs que lighthouserc.prod.cjs, sólo cambia el form factor.
// Deriva de la base en vez de duplicarla: las dos configs anteriores tenían
// ~70 líneas repetidas y ya se desincronizaron una vez.
const base = require("./lighthouserc.prod.cjs");

// Valores del preset `desktop` de Lighthouse, explícitos. La config anterior
// sólo tocaba `screenEmulation` y `formFactor`, así que heredaba el throttling
// de móvil: medía un viewport de escritorio sobre 4G lento y CPU x4, que no es
// ningún escenario real. Por eso "desktop" salía peor que "mobile".
const DESKTOP_THROTTLING = {
  rttMs: 40,
  throughputKbps: 10 * 1024,
  cpuSlowdownMultiplier: 1,
  requestLatencyMs: 0,
  downloadThroughputKbps: 0,
  uploadThroughputKbps: 0,
};

module.exports = {
  ci: {
    ...base.ci,
    collect: {
      ...base.ci.collect,
      settings: {
        formFactor: "desktop",
        throttling: DESKTOP_THROTTLING,
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
        emulatedUserAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      },
    },
  },
};
