# View Mode Toggle

> Generado por `pnpm docs:components` desde [`ViewModeToggle.astro`](../../src/components/ViewModeToggle.astro). No editar a mano.

Cambia el listado entre rejilla y lista. Son dos enlaces, no dos botones: el modo viaja en la URL como un filtro más.

## Importar

```astro
import ViewModeToggle from "./ViewModeToggle.astro";
```

Ruta relativa desde `src/components/`, que es como se importa aquí.

## Props

| Prop | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `viewMode` | `string` | sí |  |
| `lang` | `"es" \| "en"` | — |  |

## Uso

```astro
---
import ViewModeToggle from "./ViewModeToggle.astro";
---

<ViewModeToggle viewMode="grid" lang="es" />
```
