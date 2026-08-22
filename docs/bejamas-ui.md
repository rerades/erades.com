# bejamas/ui en este repo

Cómo se traen los componentes, qué se cambia siempre al copiarlos y qué
merece la pena migrar. El coste medido de lo ya migrado está en
[bejamas-ui-presupuesto.md](./bejamas-ui-presupuesto.md).

## Qué hay montado

| Pieza | Dónde | Para qué |
|---|---|---|
| Alias `@/` → `src/` | `astro.config.mjs`, `vitest.config.ts`, `tsconfig.json` | Los componentes del registry vienen escritos contra `@/lib/utils`. Los tres sitios definen alias por separado: si añades uno, van los tres. |
| `cn()` | `src/lib/utils.ts` | `clsx` + `tailwind-merge`. Es el único helper que el registry da por supuesto. |
| `components.json` | raíz | Escrito a mano. Estilo `bejamas-juno`, iconos `lucide`. No lo generó ningún CLI. |
| Script de copia | `scripts/add-bejamas-component.ts` | Lee el registry y **sólo escribe ficheros**. |
| Componentes | `src/components/ui/<componente>/` | `separator`, `dropdown-menu`, `dialog`. |
| Runtime | `@data-slot/*` en `dependencies` | Un paquete por primitiva, más `@data-slot/core` compartido. |

`src/lib/**` está en la regla de capa base de `eslint.config.js` junto a
`utils/` e `i18n/`: no importa UI.

## Por qué no se usa `bejamas add`

Comprobado en un proyecto desechable antes de decidirlo. `bejamas add`:

- se añade a sí mismo (un CLI, 386 paquetes) a `dependencies`;
- mete `class-variance-authority` aunque el componente no lo use;
- infla el lockfile ~1900 líneas;
- inyecta dos `@import` y un bloque con `@apply` en el CSS global — y `@apply`
  está prohibido en este repo (ver `CLAUDE.md`);
- escribe un placeholder roto (`msw: set this to true or false`) en
  `allowBuilds` de `pnpm-workspace.yaml`, que rompe
  `pnpm install --frozen-lockfile`.

`bejamas init` tampoco sirve: sólo escribe `components.json` y exige que el CSS
global se llame `globals.css` para detectar Tailwind v4; el nuestro es
`global.css`.

El registry es JSON plano con el contenido de cada fichero incrustado
(`https://ui.bejamas.com/r/<nombre>.json`), así que copiarlo es todo lo que
hace falta.

## El procedimiento

```bash
pnpm tsx scripts/add-bejamas-component.ts <componente>
```

Escribe en `src/components/ui/<componente>/` y **lista al final las
dependencias npm sin instalarlas**. Eso es deliberado: añadir un paquete es la
decisión que no queremos automatizar. Instálalas a mano y con versión exacta,
como el resto de `package.json`.

Luego, en este orden:

1. **Poda el `index.ts`.** El registry exporta piezas que aquí no compilan:
   `Trigger` arrastra `../button` (y con él `class-variance-authority`), y los
   `*Item` de selección arrastran `../icon/SemanticIcon`. Ninguno de los dos
   existe en este repo. Exporta sólo lo que uses, y **deja escrito en un
   comentario qué descartaste y por qué** — es lo que evita que el siguiente
   vuelva a intentarlo.
2. **El disparador va sobre el elemento real.** En vez del `Trigger` del
   registry (que con `asChild` mete un `<div>` intermedio), pon
   `data-slot="<componente>-trigger"` sobre el propio `<button>`. Así el
   runtime escribe `aria-haspopup`, `aria-controls` y `aria-expanded` en el
   elemento que de verdad se pulsa. Ver `SocialProfileMenu.astro`.
3. **Poda las clases muertas** de las variantes `Content`. Se repiten en todos
   los componentes del registry y aquí ninguna hace nada:
   - `animate-in` / `animate-out` / `fade-*` / `zoom-*` / `slide-in-from-*`:
     necesitan `tw-animate-css`, que no está instalado.
   - `cn-menu-*`, `cn-font-heading`, `no-scrollbar`: las aporta
     `bejamas/tailwind.css`, que no usamos.
   - `w-[var(--anchor-width)]`, `max-h-[var(--available-height)]`: el runtime
     nunca escribe esas variables (sólo `--transform-origin`).
4. **Sustituye `SemanticIcon` por `@lucide/astro`**, que ya se usa en el repo.
5. **Colores por token**, no a pelo: `bg-popover` / `text-popover-foreground`,
   no `bg-white dark:bg-gray-900`.
6. **Todo lo que uses en el sitio cuelga de la misma raíz `data-slot`.** El
   runtime busca disparador y contenido bajo el mismo nodo raíz. Si el botón
   vive en otro componente, múdalo (el del avatar se mudó de `Header.astro` a
   `SocialProfileMenu.astro`).

### Desviaciones del registry

Se permiten, pero **comentadas en el propio fichero** con el motivo, porque la
cabecera dice «Do not edit» y sin el comentario la siguiente copia las borra.
Las dos que hay hoy:

- `DropdownMenuItem` acepta `href` y entonces renderiza `<a>`. Un
  `<div role="menuitem">` pierde clic central, ctrl+clic y «abrir en pestaña
  nueva». Como el runtime hace `preventDefault()` sobre Enter para emitir su
  propio `select`, hace falta un listener de 10 líneas en el consumidor que
  reabra el enlace cuando `source === "keyboard"`.
- `DropdownMenuContent` y `DialogContent`, podados como en el punto 3.

## Tests

Cada migración deja tres cosas:

- **Unit** (`AstroContainer`, como el resto): que el markup salga con sus
  `data-slot` y sus atributos. `src/components/ui/separator/Separator.test.ts`
  es además la prueba de humo de la cadena: si el alias `@/` deja de resolver o
  `cn()` desaparece, falla ahí.
- **E2E** (`tests/e2e/`): el comportamiento que aporta el runtime y que el unit
  no ve — teclado, Escape, foco devuelto, click fuera. Ver
  `avatar-dropdown.spec.ts` y `mobile-menu.spec.ts`.
- **Baselines visuales** si cambia un píxel, regeneradas **desde CI** (ver
  `CLAUDE.md`). Un cambio de **dimensiones** no es antialiasing: el bloqueo de
  scroll del diálogo pone `scrollbar-gutter: stable` en `<html>` y eso creció
  la captura `mobile-menu-open` 29 px de alto. Si pasa algo así, explícalo en
  el commit.

## Qué migrar y qué no

La pregunta no es «¿existe el componente en bejamas/ui?» sino **«¿qué hace el
runtime que mi versión no hace?»**. Las dos migraciones hechas se justifican
solas:

- el dropdown a mano no tenía navegación con flechas, roles `menu`/`menuitem`,
  typeahead ni devolución del foco;
- el menú móvil llevaba un `aria-hidden="true"` escrito en el markup que seguía
  ahí con el menú abierto, y no tenía focus trap.

Con eso en la mano, del resto de componentes interactivos:

| Componente | Veredicto |
|---|---|
| `BlogFilters` | **No.** Usa un `<select>` nativo. Cambiarlo por un Select en JS es cambiar accesibilidad y teclado gratis del navegador por un bundle. |
| `LanguageSwitch`, `ViewModeToggle` | **No.** Son enlaces y botones sin estado de runtime; no hay nada que un ToggleGroup arregle. |
| `ThemeToggle` | **Marginal.** Un `<button>` con `aria-label` y un `is:inline` de 10 líneas. Sólo si algún día necesita estado de tres valores (claro/oscuro/sistema). |
| `SearchInput` | **Quizá.** Un combobox de verdad (roles `combobox`/`listbox`, flechas, anuncio de resultados) sí es trabajo que no queremos escribir. Mide antes: es la página con más JS ya. |

## El coste

`@data-slot/core` (16 KB brutos) **ya está pagado**: cada primitiva nueva sólo
añade su propio paquete (13 KB el dropdown, 4 KB el diálogo). Eso hace que la
tercera migración sea mucho más barata que la primera — pero también que la
primera saliera 5× por encima de lo estimado.

Nada bloquea hoy una subida de bytes: no hay presupuestos en las configs de
Lighthouse. Lo que sí hay es el campo `js` de `lh.ndjson`, que es
**determinista** — una subida ahí es siempre real. Ver
[lighthouse.md](./lighthouse.md). Antes y después de migrar algo grande,
mira ese campo.
