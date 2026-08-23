# If

> Generado por `pnpm docs:components` desde [`If.astro`](../../src/components/If.astro). No editar a mano.

Condicional con dos ramas. Usa slots con nombre (`Astro.slots.has()`) en vez de inspeccionar los hijos, así que la rama que no se cumple no llega a renderizarse.

Es la alternativa del repo al ternario incrustado en el markup. Para una sola rama, `ShowWhen`.

## Importar

```astro
import If from "./If.astro";
```

Ruta relativa desde `src/components/`, que es como se importa aquí.

## Props

| Prop | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `condition` | `boolean` | sí |  |

## Slots

- `then`
- `else`

Detectados en el markup; los slots con nombre se comprueban con `Astro.slots.has()`.

## Uso

```astro
---
import If from "./If.astro";
import Then from "./Then.astro";
import Else from "./Else.astro";
---

<If condition={totalPages > 1}>
  <Then slot="then"><Paginator /></Then>
  <Else slot="else">Una sola página</Else>
</If>
```
