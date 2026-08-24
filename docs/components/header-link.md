# Header Link

> Generado por `pnpm docs:components` desde [`HeaderLink.astro`](../../src/components/HeaderLink.astro). No editar a mano.

Un enlace de la navegación. Hace tres cosas que un `<a>` pelado no hace: le antepone el idioma al `href` si falta, se marca como activo (`aria-current="page"`) comparando con la ruta actual, y le pone el icono que corresponda a esa sección.

Acepta cualquier atributo de `<a>`; los que no reconoce se reenvían tal cual.

## Importar

```astro
import HeaderLink from "./HeaderLink.astro";
```

Ruta relativa desde `src/components/`, que es como se importa aquí.

## Slots

- `default`

Detectados en el markup; los slots con nombre se comprueban con `Astro.slots.has()`.

## Uso

```astro
---
import HeaderLink from "./HeaderLink.astro";
---

<HeaderLink href="/blog" lang="es">Blog</HeaderLink>
```
