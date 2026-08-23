# Blog Card

> Generado por `pnpm docs:components` desde [`BlogCard.astro`](../../src/components/BlogCard.astro). No editar a mano.

Despacha a la tarjeta de rejilla o a la de lista según `variant`. Existe para que quien pinta un listado no tenga que saber cuál de las dos toca.

## Importar

```astro
import BlogCard from "./BlogCard.astro";
```

Ruta relativa desde `src/components/`, que es como se importa aquí.

## Props

| Prop | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `post` | `any` | sí |  |
| `variant` | `"grid" \| "list"` | — |  |
| `lang` | `string` | sí |  |
| `index` | `number` | sí |  |

## Uso

```astro
---
import BlogCard from "./BlogCard.astro";
---

<BlogCard post={post} variant="grid" lang="es" index={0} />
```
