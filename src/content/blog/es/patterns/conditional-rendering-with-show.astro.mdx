---
title: "Renderizado condicional explícito"
description: "Un patrón funcional y mantenible para condicionar fragmentos de UI sin abusar de operadores lógicos ni ternarios."
pubDate: 2025-07-28
categories:
  - design patterns
tags:
  - Astro
  - Functional UI
  - JSX
  - Components
  - patterns
draft: false
heroImage: /blog-placeholder-23.jpg
---

En entornos JSX como Astro, condicionar bloques de contenido es algo habitual. Pero si abusas de ternarios o `&&`, el código acaba pareciendo un acertijo.

Este patrón propone encapsular la lógica de visibilidad en un componente semántico y reutilizable: `ShowWhen.astro`.

## El problema

```astro
<section>
  {
    currentPage === 1 && (
      <div>
        <h2>{t(lang, "blogList.title")}</h2>
        <p>{t(lang, "blogList.description")}</p>
      </div>
    )
  }
</section>
```

Este patrón es **funcional, pero opaco.** El `&&` exige conocer precedencia y estructura. Escribir lógica más compleja o anidarla lo rompe.

## La solución:

Creamos un componente dedicado a representar el _intento semántico_: mostrar contenido si se cumple una condición.

### `components/ShowWhen.astro`

```astro
---
const { when, children } = Astro.props;
---

{when && children}
```

**Así de simple.** Cualquier bloque de JSX puede ahora ser mostrado o no de forma explícita.

## Ejemplo de uso

```astro
---
import ShowWhen from "~/components/ShowWhen.astro";
---

<section>
<ShowWhen when={currentPage === 1}>
    <div>
        <h2>{t(lang, "blogList.title")}</h2>
        <p>{t(lang, "blogList.description")}</p>
      </div>
</ShowWhen>
</section>
```

## Ventajas

- ✅ **Legibilidad**: El `when` expresa el propósito. No necesitas descifrar expresiones.
- ✅ **Reutilización**: Se puede extender con logging, trazas de debug o animaciones de entrada/salida.
- ✅ **Separación de concerns**: La lógica de visibilidad se abstrae fuera del markup principal.
- ✅ **Funciona en server components y layouts**: sin efectos colaterales.

## Variantes

Podemos combinar este patrón con versiones más estructuradas:

```astro
<If condition={isLoading}>
  <Then>
    <Spinner />
  </Then>
  <Else>
    <Content />
  </Else>
</If>
```

Aunque esto añade más complejidad, puede ser útil en flujos ramificados o cuando queremos reutilizar lógica declarativa en múltiples puntos.

## Conclusión

No se trata solo de hacer que funcione. Se trata de hacer que el código comunique _qué intenta hacer_.

El componente encapsula una intención común de la UI: **mostrar algo si se cumple una condición**.
