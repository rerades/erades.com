# Reading Time

> Generado por `pnpm docs:components` desde [`ReadingTime.astro`](../../src/components/ReadingTime.astro). No editar a mano.

Los minutos de lectura de un post, traducidos. Los minutos se calculan en el build con `readingTime()` de `utils/reading-time`, la misma función que usan las tarjetas, para que tarjeta y post digan lo mismo.

## Importar

```astro
import ReadingTime from "./ReadingTime.astro";
```

Ruta relativa desde `src/components/`, que es como se importa aquí.

## Props

| Prop | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `minutes` | `number` | sí |  |
| `lang` | `string` | sí |  |

## Uso

```astro
---
import ReadingTime from "./ReadingTime.astro";
import { readingTime } from "../utils/reading-time";
---

<ReadingTime minutes={readingTime(post.body ?? "")} lang="es" />
```
