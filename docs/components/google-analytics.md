# Google Analytics

> Generado por `pnpm docs:components` desde [`GoogleAnalytics.astro`](../../src/components/GoogleAnalytics.astro). No editar a mano.

Carga GA4 solo si `PUBLIC_GA_MEASUREMENT_ID` está configurada: sin variable no emite ni una etiqueta. `gtag.js` se pide después del evento `load`, para no competir con el render ni con la imagen del LCP, y va con la IP anonimizada y las señales publicitarias desactivadas.

El condicional es un `ShowWhen` y no una expresión JSX envolvente por un motivo que está comentado en el fichero: dentro de una expresión, Astro emite el cuerpo del script literal en vez de evaluarlo.

## Importar

```astro
import GoogleAnalytics from "./GoogleAnalytics.astro";
```

Ruta relativa desde `src/components/`, que es como se importa aquí.

## Uso

```astro
---
import GoogleAnalytics from "./GoogleAnalytics.astro";
---

<GoogleAnalytics />
```
