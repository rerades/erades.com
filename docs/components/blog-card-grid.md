# Blog Card (rejilla)

> Generado por `pnpm docs:components` desde [`BlogCardGrid.astro`](../../src/components/BlogCardGrid.astro). No editar a mano.

La tarjeta de un post en modo rejilla: imagen destacada, título, fecha y descripción. `index` decide la carga de la imagen: las primeras van eager.

## Importar

```astro
import BlogCardGrid from "./BlogCardGrid.astro";
```

Ruta relativa desde `src/components/`, que es como se importa aquí.

## Props

| Prop | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `post` | `any` | sí |  |
| `lang` | `string` | sí |  |
| `index` | `number` | sí |  |

## Uso

```astro
---
import BlogCardGrid from "./BlogCardGrid.astro";
---

<BlogCardGrid post={post} lang="es" index={0} />
```
