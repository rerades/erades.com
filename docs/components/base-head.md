# Base Head

> Generado por `pnpm docs:components` desde [`BaseHead.astro`](../../src/components/BaseHead.astro). No editar a mano.

Todo lo que va en el <head> de cualquier página: metadatos globales, canónica, Open Graph, Twitter Card, los tres feeds RSS y Google Analytics.

## Importar

```astro
import BaseHead from "./BaseHead.astro";
```

Ruta relativa desde `src/components/`, que es como se importa aquí.

## Props

| Prop | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `title` | `string` | sí |  |
| `description` | `string` | sí |  |
| `image` | `string` | — |  |

## Uso

```astro
---
import BaseHead from "./BaseHead.astro";
---

<head>
  <BaseHead title={title} description={description} image={heroImage} />
</head>
```
