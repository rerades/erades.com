# Blog Filters

> Generado por `pnpm docs:components` desde [`BlogFilters.astro`](../../src/components/BlogFilters.astro). No editar a mano.

Filtro por categoría, orden y modo de vista. Es un formulario GET: el estado vive en la URL, no en JavaScript, y por eso el listado es enlazable y sobrevive a una recarga.

El orden usa el `NativeSelect` de bejamas/ui, que se envía solo con `onchange`.

## Importar

```astro
import BlogFilters from "./BlogFilters.astro";
```

Ruta relativa desde `src/components/`, que es como se importa aquí.

## Props

| Prop | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `categories` | `string[]` | sí |  |
| `selectedCategory` | `string` | sí |  |
| `sortBy` | `string` | sí |  |
| `viewMode` | `string` | sí |  |
| `tag` | `string` | — |  |
| `getCategoryHref` | `(cat: string) => string` | — |  |
| `customClass` | `string` | — |  |
| `lang` | `"es" \| "en"` | — |  |

## Uso

```astro
---
import BlogFilters from "./BlogFilters.astro";
---

<BlogFilters
  categories={categories}
  selectedCategory={selectedCategory}
  sortBy={sortBy}
  viewMode={viewMode}
  lang="es"
/>
```
