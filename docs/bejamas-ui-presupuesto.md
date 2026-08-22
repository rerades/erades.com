# Coste de la migración a bejamas/ui

Medido el 2026-08-21, comparando `4b6a371` (fontanería puesta, ningún
componente migrado) contra `master` con el dropdown y el diálogo ya migrados.

## Bytes

| | antes | después | delta |
|---|---:|---:|---:|
| JS de cliente, bruto | 2 523 B | 36 221 B | **+33 698 B** |
| JS de cliente, gzip | 1 168 B | 12 043 B | **+10 875 B** |
| CSS, bruto | 57 452 B | 62 108 B | +4 656 B |

Reparto del JS:

| fichero | bytes |
|---|---:|
| `dist.*.js` (`@data-slot/core`, compartido) | 16 154 |
| `DropdownMenu.*.js` | 13 299 |
| `Dialog.*.js` | 4 245 |
| `ec.*.js` (expressive-code, preexistente) | 2 523 |

**El brief (§5) estimaba ~6,7 KB para los dos componentes. El coste real es
~33,7 KB en bruto**, cinco veces más, porque a los dos paquetes por primitiva
hay que sumarles `@data-slot/core`, que el brief no contaba. En gzip son
~10,9 KB.

En términos relativos el sitio pasa de 2,5 KB a 36 KB de JS de cliente: es
un salto grande sobre una base que era casi cero. Conviene tenerlo presente
antes de migrar más componentes, porque `@data-slot/core` ya está pagado y
cada primitiva nueva solo añade su propio paquete.

## Presupuestos de Lighthouse

**Ya no hay.** Cuando se midió esto existía un `lighthouserc.cjs` con 200 KB de
script y 80 KB de hoja de estilo, todas las aserciones en `warn`. Ese fichero
desapareció al retirar el servidor LHCI (#169): hoy sólo quedan
`lighthouserc.prod.cjs` y su variante desktop, que **recogen** métricas contra
producción y no afirman nada.

Como referencia de dónde estaba el sitio frente a aquellos límites: 36 KB de
script y 62 KB de CSS. El CSS iba más justo (78 % del presupuesto) y eso venía
de antes de esta migración.

Lo que vigila hoy los bytes es el campo `js` de `lh.ndjson`, que es
determinista: una subida ahí es siempre real. Ver [lighthouse.md](./lighthouse.md).

## Métricas

Medido en local con `numberOfRuns=3`:

- **TBT = 0 ms** antes y después. Es la métrica que el JS afecta, y no se
  mueve: el runtime no bloquea el hilo principal.
- **CLS = 0** antes y después.

### Aviso sobre medir FCP en local

Una comparación ingenua (construir A, medir, construir B, medir) dio
FCP 1063 ms → 3085 ms y parecía una regresión de 2 s reproducible en tres
pasadas. **No lo era.** Reconstruir y reiniciar el servidor entre medidas
cambia las condiciones, y el número deriva entre sesiones: el mismo `master`
midió 3232 ms, 3081 ms, 3230 ms y 2706 ms en momentos distintos.

El experimento controlado —mismo servidor, misma sesión, alternando solo los
dos bloques `<script>` del runtime— da:

| | FCP mediana |
|---|---:|
| sin el runtime (2 523 B de JS) | 2 706 ms |
| con el runtime (36 221 B de JS) | 2 706 ms |

Cero diferencia. Tiene sentido: Astro emite esos bundles como
`<script type="module">` en el `<body>`, que van diferidos y no bloquean el
primer pintado.

Moraleja para la próxima vez: en este repo, para atribuir un cambio de FCP
hay que alternar la variable **sin reconstruir ni reiniciar el servidor**, o
medir en CI. Los valores absolutos de LCP en local (12–19 s) tampoco son
creíbles y no dependen de esta migración.

## Seguridad

`pnpm audit --audit-level moderate` pasa. Las dos vulnerabilidades que
reporta son preexistentes, llegan por `@lhci/*` y ya están en el
`ignoreGhsas` de `pnpm-workspace.yaml`. Las dependencias nuevas
(`@data-slot/dropdown-menu`, `@data-slot/dialog`, `clsx`, `tailwind-merge`)
no añaden ninguna.
