# Show When

> Generado por `pnpm docs:components` desde [`ShowWhen.astro`](../../src/components/ShowWhen.astro). No editar a mano.

Renderiza su contenido solo si la condicion se cumple. Trata el array vacío como falso, que es el caso que más veces se escapa con un `&&` a pelo.

Para dos ramas, `If` con `Then` y `Else`.

## Importar

```astro
import ShowWhen from "./ShowWhen.astro";
```

Ruta relativa desde `src/components/`, que es como se importa aquí.

## Props

| Prop | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `when` | `unknown` | sí |  |

## Slots

- `default`

Detectados en el markup; los slots con nombre se comprueban con `Astro.slots.has()`.

## Uso

```astro
---
import ShowWhen from "./ShowWhen.astro";
---

<ShowWhen when={tags}>
  <TagList tags={tags} />
</ShowWhen>
```
