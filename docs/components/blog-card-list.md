# Blog Card (lista)

> Generado por `pnpm docs:components` desde [`BlogCardList.astro`](../../src/components/BlogCardList.astro). No editar a mano.

La tarjeta de un post en modo lista: la misma información que en rejilla pero en horizontal, con la imagen a un lado.

## Importar

```astro
import BlogCardList from "./BlogCardList.astro";
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
import BlogCardList from "./BlogCardList.astro";
---

<BlogCardList post={post} lang="es" index={0} />
```
