# Separator

> Generado por `pnpm docs:components` desde el JSDoc de [`Separator.astro`](../../src/components/ui/separator/Separator.astro). No editar a mano: los cambios se pierden en la siguiente copia del registry.

Visual separator for grouping content, supporting horizontal and vertical orientation.

Estado: **stable** · [Figma](https://www.figma.com/design/koxai7zw5vIuBzuVxe5T2l/bejamas-ui?node-id=2511-5829&t=YFStJ3V8fXEO8QD8-4)

## Exports en este repo

- `Separator` — `Separator.astro`

```astro
import { Separator } from "./ui/separator";
```

Ruta relativa desde `src/components/`, que es como se importan aquí (ver `BlogFilters.astro`, `Header.astro`).

## Preview

```astro
<div>
  <div class="space-y-1">
    <h4 class="text-sm leading-none font-medium">bejamas/ui</h4>
    <p class="text-muted-foreground text-sm">
      An open-source UI component library.
    </p>
  </div>
  <Separator class="my-4" />
  <div class="flex h-5 items-center space-x-4 text-sm">
    <div>Blog</div>
    <Separator orientation="vertical" />
    <div>Docs</div>
    <Separator orientation="vertical" />
    <div>Source</div>
  </div>
</div>
```

## Uso

```astro
---
import { Separator } from './ui/separator';
---

<Separator />
<Separator orientation="vertical" />
```
