# Series Nav

> Generado por `pnpm docs:components` desde [`SeriesNav.astro`](../../src/components/SeriesNav.astro). No editar a mano.

El bloque «Parte N de M» al final de un post que pertenece a una serie (`series` en el frontmatter), con enlaces al anterior y al siguiente. La posición la calcula `seriesNav()` de `utils/series` en el build; el nombre de la serie sale de `series.<id>` en i18n. El nombre de la serie enlaza a su índice (`/[lang]/series/[id]/`). Sin serie no pinta nada.

## Importar

```astro
import SeriesNav from "./SeriesNav.astro";
```

Ruta relativa desde `src/components/`, que es como se importa aquí.

## Props

| Prop | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `series` | `SeriesNavData<CollectionEntry<"blog">>` | — |  |
| `lang` | `string` | sí |  |

## Uso

```astro
---
import { getCollection } from "astro:content";
import SeriesNav from "./SeriesNav.astro";
import { seriesNav } from "../utils/series";
const series = seriesNav(post, await getCollection("blog"));
---

<SeriesNav series={series} lang="es" />
```
