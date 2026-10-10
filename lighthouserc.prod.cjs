// Mide PRODUCCIÓN, no el preview local: es lo que ven los lectores y lo único
// comparable entre ejecuciones. El histórico se guarda vía scripts/lh-record.ts
// en lh.ndjson, en la rama `metrics`, no en un servidor LHCI.
//
// Sin `?device=`: el form factor va en la config y queda registrado en la fila,
// así que el marcador en la URL sólo servía para separar filas en el dashboard
// que ya no existe.
const URLS = [
  "https://erades.com/es",
  "https://erades.com/es/blog",
  "https://erades.com/es/about",
  "https://erades.com/es/tags",
  "https://erades.com/es/search?q=func",
  "https://erades.com/es/blog/ia/i18n/",
];

module.exports = {
  ci: {
    collect: {
      url: URLS,
      numberOfRuns: 3,
      settings: {
        formFactor: "mobile",
        // Lighthouse v10+ quitó "Chrome-Lighthouse" del UA móvil por defecto.
        // GoogleAnalytics.astro lo necesita para no contar la visita: hay que
        // añadirlo explícitamente.
        emulatedUserAgent:
          "Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse",
      },
    },
  },
};
