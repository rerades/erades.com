# Header

> Generado por `pnpm docs:components` desde [`Header.astro`](../../src/components/Header.astro). No editar a mano.

La cabecera del sitio: logo, navegación, buscador, cambio de idioma, tema, menú de perfil y el menú móvil, que es un `Dialog` de bejamas/ui.

Aquí vive también el único listener delegado que atiende a todos los `[data-lang-switch]` del documento, haya uno o varios.

## Importar

```astro
import Header from "./Header.astro";
```

Ruta relativa desde `src/components/`, que es como se importa aquí.

## Props

| Prop | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `lang` | `string` | sí |  |

## Uso

```astro
---
import Header from "./Header.astro";
---

<Header lang="es" />
```
