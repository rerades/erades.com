# Icon Wrapper

> Generado por `pnpm docs:components` desde [`IconWrapper.astro`](../../src/components/IconWrapper.astro). No editar a mano.

Pinta un icono de `@lucide/astro` solo si se le pasa uno. Evita el `{Icon && <Icon />}` repetido en cada sitio donde el icono es opcional.

## Importar

```astro
import IconWrapper from "./IconWrapper.astro";
```

Ruta relativa desde `src/components/`, que es como se importa aquí.

## Props

| Prop | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `Icon` | `any` | — |  |
| `className` | `string` | — |  |

## Uso

```astro
---
import IconWrapper from "./IconWrapper.astro";
import { House } from "@lucide/astro";
---

<IconWrapper Icon={House} className="h-4 w-4" />
```
