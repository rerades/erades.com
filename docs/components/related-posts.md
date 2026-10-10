# Related Posts

> Generado por `pnpm docs:components` desde [`RelatedPosts.astro`](../../src/components/RelatedPosts.astro). No editar a mano.

Las tarjetas de «sigue leyendo» al final de un post. La selección la hace `relatedPosts()` de `utils/related-posts` en el build (tags en común, después fecha); este componente solo las pinta con `BlogCard`. Sin posts no pinta nada.

## Importar

```astro
import RelatedPosts from "./RelatedPosts.astro";
```

Ruta relativa desde `src/components/`, que es como se importa aquí.

## Props

| Prop | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `posts` | `readonly CollectionEntry<"blog">[]` | sí |  |
| `lang` | `string` | sí |  |

## Uso

```astro
---
import { getCollection } from "astro:content";
import RelatedPosts from "./RelatedPosts.astro";
import { relatedPosts } from "../utils/related-posts";
const related = relatedPosts(post, await getCollection("blog"));
---

<RelatedPosts posts={related} lang="es" />
```
