# Blog List

> Generado por `pnpm docs:components` desde [`BlogList.astro`](../../src/components/BlogList.astro). No editar a mano.

Orquesta un listado completo: filtros, tarjetas, paginador, contador de resultados y estado vacío. Las páginas de blog, tags y búsqueda son todas este componente con props distintas.

Recibe `posts` (el total, para contar) y `paginatedPosts` (lo que pinta) por separado.

## Importar

```astro
import BlogList from "./BlogList.astro";
```

Ruta relativa desde `src/components/`, que es como se importa aquí.

## Props

| Prop | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `posts` | `any[]` | sí |  |
| `categories` | `string[]` | sí |  |
| `selectedCategory` | `string` | sí |  |
| `sortBy` | `string` | sí |  |
| `viewMode` | `"grid" \| "list"` | sí |  |
| `currentPage` | `number` | sí |  |
| `totalPages` | `number` | sí |  |
| `paginatedPosts` | `any[]` | sí |  |
| `getCategoryHref` | `(cat: string) => string` | sí |  |
| `getPageHref` | `(page: number) => string` | sí |  |
| `tag` | `string` | — |  |
| `lang` | `"es" \| "en"` | sí |  |
| `title` | `string` | — |  |
| `description` | `string` | — |  |
| `showTitle` | `boolean` | — |  |
| `query` | `string` | — |  |
| `noResultsResetHref` | `string` | — |  |

## Uso

```astro
---
import BlogList from "./BlogList.astro";
---

<BlogList
  posts={posts}
  paginatedPosts={paginatedPosts}
  categories={categories}
  selectedCategory={selectedCategory}
  sortBy={sortBy}
  viewMode="grid"
  currentPage={1}
  totalPages={3}
  getCategoryHref={getCategoryHref}
  getPageHref={getPageHref}
  lang="es"
/>
```
