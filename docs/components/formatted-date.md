# Formatted Date

> Generado por `pnpm docs:components` desde [`FormattedDate.astro`](../../src/components/FormattedDate.astro). No editar a mano.

Una fecha en un `<time datetime>`, formateada según el idioma. El atributo `datetime` lleva siempre la fecha ISO, que es lo que leen los buscadores y los lectores de pantalla.

## Importar

```astro
import FormattedDate from "./FormattedDate.astro";
```

Ruta relativa desde `src/components/`, que es como se importa aquí.

## Props

| Prop | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `date` | `Date` | sí |  |
| `lang` | `string` | — |  |

## Uso

```astro
---
import FormattedDate from "./FormattedDate.astro";
---

<FormattedDate date={post.data.pubDate} lang="es" />
```
