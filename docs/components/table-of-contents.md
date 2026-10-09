# Table of Contents

> Generado por `pnpm docs:components` desde [`TableOfContents.astro`](../../src/components/TableOfContents.astro). No editar a mano.

El índice de un post, a partir de los `headings` que devuelve `render()`. Solo aparece con tres o más `h2`: con menos no ahorra nada. En móvil va plegado en un `<details>` nativo y en escritorio abierto, sin JS en ningún caso.

## Importar

```astro
import TableOfContents from "./TableOfContents.astro";
```

Ruta relativa desde `src/components/`, que es como se importa aquí.

## Props

| Prop | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `headings` | `readonly MarkdownHeading[]` | sí |  |
| `lang` | `string` | sí |  |

## Uso

```astro
---
import { render } from "astro:content";
import TableOfContents from "./TableOfContents.astro";
const { headings } = await render(post);
---

<TableOfContents headings={headings} lang="es" />
```
