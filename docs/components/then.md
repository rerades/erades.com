# Then

> Generado por `pnpm docs:components` desde [`Then.astro`](../../src/components/Then.astro). No editar a mano.

La rama verdadera de un `If`. No decide nada: solo envuelve el contenido para que `If` lo reciba como el slot `then`.

## Importar

```astro
import Then from "./Then.astro";
```

Ruta relativa desde `src/components/`, que es como se importa aquí.

## Slots

- `default`

Detectados en el markup; los slots con nombre se comprueban con `Astro.slots.has()`.

## Uso

```astro
---
import If from "./If.astro";
import Then from "./Then.astro";
---

<If condition={hasResults}>
  <Then slot="then">Resultados</Then>
</If>
```
