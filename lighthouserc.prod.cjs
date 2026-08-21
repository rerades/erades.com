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
  "https://erades.com/es/blog/ai-take-aways/i18n/",
];

module.exports = {
  ci: {
    collect: {
      url: URLS,
      numberOfRuns: 3,
      settings: { formFactor: "mobile" },
    },
  },
};
