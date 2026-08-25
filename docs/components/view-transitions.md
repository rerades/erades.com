# View Transitions

> Generado por `pnpm docs:components` desde [`ViewTransitions.astro`](../../src/components/ViewTransitions.astro). No editar a mano.

El pegamento de las transiciones entre páginas: marca el título de la tarjeta que se acaba de pulsar para que vuele hasta el título del post. No renderiza nada; las animaciones en sí viven en `global.css`. Va en el `<head>`, dentro de `BaseHead`.

## Importar

```astro
import ViewTransitions from "./ViewTransitions.astro";
```

Ruta relativa desde `src/components/`, que es como se importa aquí.

## Uso

```astro
---
import ViewTransitions from "./ViewTransitions.astro";
---

<head>
  <ViewTransitions />
</head>
```
