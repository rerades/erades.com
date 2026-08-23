# No Results

> Generado por `pnpm docs:components` desde [`NoResults.astro`](../../src/components/NoResults.astro). No editar a mano.

El estado vacío de un listado: un mensaje y, si se le da `onResetHref`, un enlace para quitar los filtros.

## Importar

```astro
import NoResults from "./NoResults.astro";
```

Ruta relativa desde `src/components/`, que es como se importa aquí.

## Props

| Prop | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `onResetHref` | `string` | — |  |
| `lang` | `"es" \| "en"` | — |  |

## Uso

```astro
---
import NoResults from "./NoResults.astro";
---

<NoResults onResetHref="/es/blog" lang="es" />
```
