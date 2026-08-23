# Results Info

> Generado por `pnpm docs:components` desde [`ResultsInfo.astro`](../../src/components/ResultsInfo.astro). No editar a mano.

El «mostrando N de M» de un listado, con la consulta si la hubo. No se pinta cuando no hay nada que contar.

## Importar

```astro
import ResultsInfo from "./ResultsInfo.astro";
```

Ruta relativa desde `src/components/`, que es como se importa aquí.

## Props

| Prop | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `shown` | `number` | sí |  |
| `total` | `number` | sí |  |
| `query` | `string` | — |  |
| `lang` | `"es" \| "en"` | — |  |

## Uso

```astro
---
import ResultsInfo from "./ResultsInfo.astro";
---

<ResultsInfo shown={10} total={42} query="astro" lang="es" />
```
