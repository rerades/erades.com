# Paginator

> Generado por `pnpm docs:components` desde [`Paginator.astro`](../../src/components/Paginator.astro). No editar a mano.

Paginación con anterior, siguiente y números. Navega con enlaces reales, no con JavaScript: cada página tiene su URL y se puede compartir.

Con `disableInactive` los extremos se pintan apagados en vez de desaparecer, para que la barra no cambie de ancho al llegar al final.

## Importar

```astro
import Paginator from "./Paginator.astro";
```

Ruta relativa desde `src/components/`, que es como se importa aquí.

## Props

| Prop | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `currentPage` | `number` | sí | Página actual (1-indexed) |
| `totalPages` | `number` | sí | Número total de páginas |
| `getPageHref` | `(page: number) => string` | — | Función para generar la URL de cada página |
| `prevLabel` | `string` | — | Texto para el botón anterior |
| `nextLabel` | `string` | — | Texto para el botón siguiente |
| `disableInactive` | `boolean` | — | Si deshabilitar los enlaces cuando no son navegables |
| `customClass` | `string` | — | Clase adicional para el contenedor |
| `ariaLabel` | `string` | — | Etiqueta ARIA para describir el propósito de la paginación |
| `lang` | `"es" \| "en"` | — | Idioma de la interfaz |

## Uso

```astro
---
import Paginator from "./Paginator.astro";
---

<Paginator
  currentPage={2}
  totalPages={5}
  getPageHref={(page) => `/es/blog/page/${page}`}
  lang="es"
/>
```
