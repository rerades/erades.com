# Else

> Generado por `pnpm docs:components` desde [`Else.astro`](../../src/components/Else.astro). No editar a mano.

La rama falsa de un `If`. No decide nada: solo envuelve el contenido para que `If` lo reciba como el slot `else`.

## Importar

```astro
import Else from "./Else.astro";
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
import Else from "./Else.astro";
---

<If condition={posts.length > 0}>
  <Then slot="then">Hay posts</Then>
  <Else slot="else">No hay ninguno</Else>
</If>
```
