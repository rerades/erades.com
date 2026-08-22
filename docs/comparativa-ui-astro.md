# Comparativa: librerías de componentes UI estilo shadcn para Astro

Evalúa cuatro alternativas de "copy-in registry" para construir componentes
Astro con Tailwind CSS v4, frente a lo que ya hay montado con bejamas/ui
(`src/components/ui/**`, ver [`bejamas-ui.md`](./bejamas-ui.md) y su coste
medido en [`bejamas-ui-presupuesto.md`](./bejamas-ui-presupuesto.md)).
Investigado el 2026-08-22 sobre los repos públicos de cada proyecto.

| Librería | Repo | Estrellas | Licencia | Último push |
|---|---|---:|---|---|
| bejamas/ui | [bejamas/ui](https://github.com/bejamas/ui) | 219 | MIT | 2026-07-14 |
| full.dev UI | [fulldotdev/ui](https://github.com/fulldotdev/ui) | 599 | MIT | 2026-07-16 |
| Basecoat UI | [hunvreus/basecoat](https://github.com/hunvreus/basecoat) | 4 251 | MIT | 2026-07-21 |
| Starwind UI | [starwind-ui/starwind-ui](https://github.com/starwind-ui/starwind-ui) | 707 | MIT | 2026-08-21 |

## 1. bejamas/ui (ya en uso)

- **Distribución**: registry JSON plano (`https://ui.bejamas.com/r/<nombre>.json`)
  con el contenido de cada fichero incrustado. Se copia con un script propio
  (`scripts/add-bejamas-component.ts`), nunca con la CLI oficial.
- **Astro-nativo**: sí, componentes `.astro` puros.
- **Interactividad**: paquetes `@data-slot/*` en `dependencies` (uno por
  primitiva + `@data-slot/core` compartido). El runtime lee atributos
  `data-slot` en el DOM ya renderizado y añade comportamiento (teclado,
  roles ARIA, foco) sin re-renderizar nada — no es una isla de framework.
- **Tailwind v4**: sí, es el estado actual del repo.
- **`@apply`**: el registry no lo usa en los componentes que se han copiado;
  la CLI oficial sí lo inyecta en el CSS global si se usa (motivo por el que
  no se usa esa CLI aquí).
- **Coste medido en este repo**: dropdown + dialog = +33 698 B de JS bruto
  (+10 875 B gzip), de los cuales 16 154 B son `@data-slot/core` **compartido
  por todos los componentes futuros** — ya pagado.

## 2. full.dev UI (fulldotdev/ui)

- **Distribución**: registry compatible con la CLI de `shadcn`
  (`npx shadcn@latest add @fulldev/<componente>`), componentes y "blocks"
  como ficheros fuente versionables.
- **Astro-nativo**: sí, orientado explícitamente a "sitios Astro
  content-driven".
- **Interactividad — hallazgo relevante**: su propio `package.json` depende
  de **los mismos paquetes `@data-slot/*`** que ya están instalados en este
  repo (`@data-slot/accordion`, `@data-slot/alert-dialog`, `@data-slot/combobox`,
  `@data-slot/dialog`, `@data-slot/dropdown-menu`, `@data-slot/popover`,
  `@data-slot/select`, `@data-slot/tabs`, `@data-slot/tooltip`, etc., más
  `@data-slot/core`). Es el mismo runtime que bejamas/ui, no uno alternativo.
  Catálogo de 60 componentes, mayor que el de bejamas/ui.
- **Tailwind v4**: sí (`tailwindcss: ^4.3.2` en su propio proyecto).
- **`@apply`**: aparece en 19 ficheros de su repo, pero son los ficheros de
  *typography* (`typography-h1.astro`, `typography-table.astro`, etc.) y el
  `global.css` de su propio sitio de documentación — no en los componentes
  interactivos que se copiarían. Habría que revisar caso por caso al copiar
  un componente de tipografía.
- **Dependencias adicionales que arrastra su propio stack** (no
  necesariamente el componente que se copie): `class-variance-authority`,
  `tw-animate-css`, `clsx`, `tailwind-merge`, `lucide-static` — las mismas
  que el playbook de bejamas/ui ya identifica como "clases muertas si no se
  instalan" y que el procedimiento de poda ya cubre.

## 3. Basecoat UI

- **Distribución**: paquete npm (`basecoat-css`) con CSS + JS vanilla, o CDN,
  o plantillas Nunjucks/Jinja. No es un registry copy-in por defecto (aunque
  el CSS se puede importar por piezas: `basecoat-css/base` + estilo suelto).
- **Astro-nativo**: no. Es "framework-agnostic": HTML semántico + JS vanilla
  sin dependencia de React/Radix/ningún runtime de framework. Se integraría
  en Astro como HTML plano con `<script>` que llama a
  `window.basecoat.init(name)` / `initAll()`.
- **Interactividad**: JS vanilla por componente, sin build step obligatorio,
  ficheros pequeños e independientes (`dropdown-menu.js` ~7,8 KB fuente sin
  minificar, `select.js` ~17,9 KB, `accordion.js` ~2,4 KB, `popover.js`
  ~2,8 KB). Sin medir el bundle final minificado+gzip para este repo, pero el
  patrón (una función `init()` idempotente por componente, sin runtime
  compartido pesado) es comparable en espíritu al de `@data-slot/*`.
- **Tailwind v4**: sí, es su target explícito (`tailwindcss: ^4.1.17`).
- **`@apply`**: se usa dentro de las hojas de *sus propios* ficheros CSS de
  componente (`src/css/components/*.css`) — es cómo Basecoat define sus
  clases (`.btn`, `.dialog`, etc.) para poder consumirse también fuera de
  Tailwind (Nunjucks/Jinja, CDN). Eso es interno a su paquete, no algo que
  este repo tendría que escribir — pero **si se copian esos ficheros CSS al
  repo** en vez de consumir el paquete tal cual, se estaría importando
  `@apply` al CSS del proyecto, lo que la convención del repo prohíbe.
- **Madurez**: con diferencia el proyecto más popular (4 251 ★ vs. 219–707 de
  los otros tres) y con más issues abiertas (34, señal de más superficie de
  uso real).

## 4. Starwind UI

- **Distribución**: CLI propia (`npx starwind@latest init` / `add`), instala
  un adaptador Astro (`@starwind-ui/astro`) publicado como **código fuente**
  (`.astro`/`.ts`, no un bundle), más un paquete runtime compartido
  (`@starwind-ui/runtime`) del que el adaptador depende como dependencia npm
  normal (no copy-in).
- **Astro-nativo**: adaptador dedicado, y también hay adaptador React —
  "framework-portable" es el argumento de venta.
- **Interactividad**: un "Runtime" DOM-first compartido entre los adaptadores
  Astro y React (arquitectura similar en espíritu a `@data-slot`, pero de
  otro autor y sin relación con ese paquete).
- **Tailwind v4**: sí, explícito ("Animado por defecto... con Tailwind CSS v4").
- **Tamaño**: aquí hay una diferencia real de escala. El propio repo publica
  una comparativa de bundle: `@starwind-ui/runtime` solo son **136,1 KiB
  minificado+gzip**, y el paquete `@starwind-ui/astro` en fuente son
  **20,9 KiB min+gzip / 32,3 KiB de tarball npm** — para el catálogo
  completo. No hay una cifra oficial de "cuánto pesa añadir solo un
  dropdown", así que no es comparable 1:1 con los 13 KB medidos para
  `DropdownMenu` de `@data-slot`; haría falta medirlo en este repo con un
  build real antes de decidir. Registrarlo como riesgo abierto, no como dato
  cerrado.
- **`@apply`**: aparece solo en plantillas de configuración (`starwind.css.ts`
  del CLI, CSS de la propia demo del repo) — no en los `.astro` de
  componente.
- **Madurez**: 707 ★, único de los tres candidatos con actividad **el mismo
  día** de esta investigación (2026-08-21) — el más activo en el momento de
  medir, aunque construido en gran parte con asistencia de Codex/GPT-5.6
  durante un "Build Week", según su propio README, lo que interesa como dato
  de procedencia del código, no como bloqueante.

## Comparativa

| Criterio | bejamas/ui | full.dev UI | Basecoat UI | Starwind UI |
|---|---|---|---|---|
| Distribución | Copy-in (JSON registry) | Copy-in (CLI shadcn-compatible) | npm package / CDN / plantillas | Copy-in (CLI propia) + runtime npm |
| Astro-nativo | Sí | Sí | No (agnóstico, HTML+JS vanilla) | Sí (adaptador dedicado) |
| Runtime de interactividad | `@data-slot/*` | `@data-slot/*` (**el mismo**) | JS vanilla propio, sin build | `@starwind-ui/runtime` propio |
| Tailwind v4 | Sí | Sí | Sí | Sí |
| `@apply` en componentes copiables | No | Solo en tipografía de su doc-site | Sí, interno a sus hojas CSS | No |
| Licencia | MIT | MIT | MIT | MIT |
| Estrellas GitHub | 219 | 599 | 4 251 | 707 |
| JS ya pagado en este repo | Sí (16 KB `@data-slot/core`) | Sí (mismo runtime) | No, JS distinto de cero | No, runtime distinto de cero |
| Coste de un componente adicional (medido/estimado) | ~4–13 KB bruto por primitiva | Comparable a bejamas (mismo runtime) | Pocos KB, sin medir en este repo | Sin cifra por componente, solo agregada |

## Encaje con las restricciones de este repo

- **Alias `@/`, `cn()`, `components.json`**: ya montados para el patrón
  bejamas/ui. full.dev UI, al usar el mismo runtime `@data-slot`, no exige
  tocar nada de esa fontanería — solo cambia de dónde se copia el fichero
  fuente. Basecoat y Starwind partirían de cero esa capa (Basecoat no la
  necesita porque no es JS/TS con imports; Starwind sí tendría que definir su
  propia convención de import).
- **Prohibición de `@apply`**: bejamas/ui y Starwind no lo requieren en los
  componentes copiables. full.dev UI lo usa solo en tipografía (evitable, no
  se copiaría ese componente o se reescribiría a utilidades). Basecoat lo usa
  como mecanismo central de su CSS — consumirlo como paquete npm (`import
  "basecoat-css"`) evita que ese `@apply` entre en el CSS del repo, pero
  copiar sus ficheros `.css` sí lo importaría, y eso rompe la convención.
- **`no-restricted-imports` / capas (`pages` → `layouts` → `components`)**:
  ninguna de las cuatro fuerza una estructura de imports concreta; el patrón
  actual (`src/components/ui/<componente>/`) es compatible con las cuatro.
- **Suite visual (Playwright/Docker)**: cualquier sustitución de componente
  interactivo mueve baselines igual con cualquiera de las cuatro — no es un
  criterio que decante la elección.
- **Sin budgets de Lighthouse, pero con `js` determinista en `lh.ndjson`**:
  el dato real es que bejamas/ui y full.dev UI comparten el mismo coste ya
  medido (`docs/bejamas-ui-presupuesto.md`); Basecoat es la única opción con
  indicios de un coste de JS menor por diseño (sin runtime compartido
  pesado, JS por componente de pocos KB en fuente); Starwind es la única sin
  cifra fiable por componente en este repo.

### Coste de migrar los tres componentes ya copiados (separator, dropdown-menu, dialog)

- **A full.dev UI**: coste más bajo de los tres candidatos nuevos. Mismo
  runtime `@data-slot` ya instalado y pagado — la migración es sustituir el
  fichero `.astro` copiado (posible poda distinta, mismo `data-slot` en el
  DOM) sin tocar `dependencies` de esas tres primitivas ni el bundle de JS.
  El playbook de poda de `bejamas-ui.md` (puntos 1–6) aplica prácticamente
  igual, porque ambos registries están escritos contra el mismo runtime.
- **A Basecoat UI**: reescritura completa de los tres componentes a HTML
  semántico + `data-*`/clases de Basecoat, sustituyendo `@data-slot/*` por
  `window.basecoat.init()`. Se pierde el `@data-slot/core` ya pagado (16 KB)
  pero se gana JS vanilla sin runtime compartido — habría que medir si el
  resultado neto en `lh.ndjson` sube o baja antes de decidir. Requiere
  reescribir los tests unitarios y E2E que hoy dependen del contrato
  `data-slot`/ARIA que pone el runtime `@data-slot`.
- **A Starwind UI**: coste más alto. No comparte runtime con lo existente
  (`@starwind-ui/runtime` en vez de `@data-slot/*`), exige montar su propia
  convención de import/CLI, y no hay cifra publicada de coste por componente
  individual con la que presupuestar el cambio antes de hacerlo — solo
  agregados de catálogo completo.

## Recomendación

**No hay motivo para salir de la familia `@data-slot` que ya está pagada en
este repo.** Entre las cuatro, full.dev UI es la única que amplía el
catálogo (60 componentes vs. los que trae bejamas/ui) sin añadir un segundo
runtime de interactividad ni romper ninguna convención dura del repo
(Tailwind v4, sin `@apply` en componentes, mismo patrón copy-in). Se
recomienda:

1. **Mantener bejamas/ui como fuente primaria** para lo que ya cubre
   (separator, dropdown-menu, dialog) — no hay razón para tocar código que
   funciona y ya tiene tests y baselines.
2. **Usar full.dev UI como fuente adicional** cuando se necesite un
   componente que bejamas/ui no tiene (p. ej. `combobox`, `command`,
   `navigation-menu`, `carousel`), aplicando el mismo procedimiento de poda
   documentado en `bejamas-ui.md` (puntos 1–6) y comentando las desviaciones
   igual que hoy.
3. **No adoptar Basecoat UI ni Starwind UI** para uso general en este
   momento:
   - Basecoat exigiría abandonar el patrón `@data-slot` ya invertido y
     reescribir tests/E2E existentes; queda como opción a revisar solo si
     algún día el coste de JS de `@data-slot/core` se vuelve un problema
     medido (hoy TBT y CLS son 0, así que no hay evidencia de que lo sea).
   - Starwind UI no tiene cifra de coste por componente individual medible
     en este repo, y montar su convención en paralelo a la de bejamas/ui
     duplicaría fontanería (dos runtimes de interactividad conviviendo) sin
     un beneficio claro sobre full.dev UI.

**Riesgo a registrar, no a ignorar**: antes de copiar el primer componente de
full.dev UI conviene repetir la medición de `docs/bejamas-ui-presupuesto.md`
(campo `js` de `lh.ndjson` antes/después) para confirmar que, al compartir
runtime, el coste marginal es efectivamente bajo y no hay una versión
distinta de `@data-slot/core` que duplique el paquete ya instalado.

## Referencias

- [bejamas/ui](https://github.com/bejamas/ui)
- [fulldotdev/ui](https://github.com/fulldotdev/ui) — [ui.full.dev](https://ui.full.dev/)
- [hunvreus/basecoat](https://github.com/hunvreus/basecoat) — [basecoatui.com](https://basecoatui.com/)
- [starwind-ui/starwind-ui](https://github.com/starwind-ui/starwind-ui) — [starwind.dev](https://starwind.dev/)
- [`bejamas-ui.md`](./bejamas-ui.md), [`bejamas-ui-presupuesto.md`](./bejamas-ui-presupuesto.md), [`lighthouse.md`](./lighthouse.md)
