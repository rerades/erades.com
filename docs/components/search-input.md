# Search Input

> Generado por `pnpm docs:components` desde [`SearchInput.astro`](../../src/components/SearchInput.astro). No editar a mano.

El campo de busqueda, con su etiqueta accesible y el valor actual de la consulta. No busca nada por sí mismo: quien lo envuelve decide a dónde va el formulario.

## Importar

```astro
import SearchInput from "./SearchInput.astro";
```

Ruta relativa desde `src/components/`, que es como se importa aquí.

## Props

| Prop | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `query` | `string` | — |  |
| `lang` | `string` | sí |  |

## Uso

```astro
---
import SearchInput from "./SearchInput.astro";
---

<form action="/es/search" method="get">
  <SearchInput query={query} lang="es" />
</form>
```
