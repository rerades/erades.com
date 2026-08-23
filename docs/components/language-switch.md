# Language Switch

> Generado por `pnpm docs:components` desde [`LanguageSwitch.astro`](../../src/components/LanguageSwitch.astro). No editar a mano.

Botones ES/EN. Existe porque este markup se renderiza dos veces —una en la
barra de escritorio y otra dentro del menú móvil— y estaba duplicado a mano:
de ahí salieron los ids `lang-es`/`lang-en` repetidos que dejaban muertos los
botones del móvil. Con un solo origen, ese fallo no puede volver por copia.

El comportamiento no vive aquí: un único listener delegado en Header.astro
atiende a todos los `[data-lang-switch]` del documento, haya los que haya.

## Importar

```astro
import LanguageSwitch from "./LanguageSwitch.astro";
```

Ruta relativa desde `src/components/`, que es como se importa aquí.

## Props

| Prop | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `lang` | `string` | sí |  |
| `class` | `string` | — |  |

## Uso

```astro
---
import LanguageSwitch from "./LanguageSwitch.astro";
---

<LanguageSwitch lang="es" class="ml-auto" />
```
