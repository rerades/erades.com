# Lighthouse: registro de rendimiento

El histórico de rendimiento vive en **`lh.ndjson`, en la rama `metrics`**: una
línea por `(url, form factor)` y ejecución. Git es la base de datos:
`git log -p origin/metrics -- lh.ndjson` es la gráfica.

No hay servidor, ni Docker, ni SQLite. Los hubo — ver [Por qué ya no hay
servidor](#por-qué-ya-no-hay-servidor).

## Por qué en una rama aparte

Render despliega este repo con `autoDeploy` por commit sobre `master` y sin
caché de build. Un commit semanal del bot a `master` dispararía un rebuild
completo de producción por un fichero de datos que no toca el sitio: 52
despliegues al año para nada.

`metrics` es una rama huérfana de sólo datos (`lh.ndjson` + un README). Render
no la mira, así que no despliega. No se mergea a `master` nunca.

## Cómo se ejecuta

Semanalmente (lunes 05:00 UTC) y a mano, vía
`.github/workflows/lighthouse.yml`. Para medir un deploy concreto: **Actions →
Lighthouse → Run workflow**, una vez Render haya terminado de desplegar.

El workflow deliberadamente **no** se dispara con `push` a `master`: Render
despliega en paralelo, y no hay forma de saber si `erades.com` ya sirve el
commit nuevo. Medir ahí registraría la versión vieja bajo el hash nuevo, que es
peor que no medir.

A mano en local:

```bash
pnpm lh:collect   # 6 URLs x 3 runs x mobile+desktop contra producción
pnpm lh:record    # .lighthouseci/*.json -> filas NDJSON
```

En local `lh:record` escribe en `metrics/lh.ndjson`, que está **gitignorado**:
es un borrador para mirar números, no el histórico. La CI le pasa `LH_OUT`
apuntando al checkout de la rama `metrics`, que es donde se acumula de verdad.

Las filas llevan `commit: "local"` cuando no hay `GITHUB_SHA`, para que una
medición de tu portátil no se confunda con una de la CI.

## Qué se mide

**Producción, no el preview local.** Es lo que ven los lectores y lo único
comparable entre ejecuciones. Las URLs están en `lighthouserc.prod.cjs`;
`lighthouserc.prod.desktop.cjs` deriva de ella y sólo cambia el form factor.

Cada fila:

```json
{"ts":"2026-08-21","commit":"local","url":"/es","ff":"mobile",
 "perf":75,"a11y":94,"bp":100,"seo":100,
 "fcp":963,"lcp":12062,"tbt":10,"cls":0.0238,"si":963,
 "js":182799,"css":9760,"img":2376406,"bytes":2741623}
```

Scores 0-100, tiempos en ms, tamaños en bytes de transferencia. Mediana de las
3 runs **por métrica** — igual que hacían las columnas `_median` del servidor
LHCI, y no "la run mediana": una run entera puede ser mala por un solo
percentil y arrastrar métricas que estaban bien.

### Cómo leerlo

Los campos de **bytes son deterministas**: no dependen del ruido del runner, así
que una subida en `js` o `bytes` es siempre una regresión real. Los de **tiempo
no lo son**: los runners de GitHub varían ±5 puntos de `perf` entre ejecuciones
idénticas. Léelos como tendencia a semanas, nunca como "este commit me bajó 3
puntos".

Consultas típicas:

```bash
# evolución del peso de JS en la home mobile
git show origin/metrics:lh.ndjson \
  | grep '"url":"/es","ff":"mobile"' \
  | jq -r '[.ts,.commit,.js,.perf] | @tsv'

# el diff de la última medición
git log -1 -p origin/metrics -- lh.ndjson
```

## Por qué ya no hay servidor

Hubo un servidor LHCI en Docker con la base SQLite versionada en Git LFS. Se
usó diez días en agosto de 2025 y se abandonó. Cuando se retomó un año después
hizo falta instalar `git-lfs`, bajar 124 MB y sacar un token de dentro del
propio SQLite antes de poder medir nada.

Los números: **~20 MB de blob en LFS por ejecución** para guardar unas 40
cifras, contra ~1,8 KB de NDJSON. Y la cuota gratuita de LFS en GitHub es 1 GB.

Además la config antigua mezclaba URLs de `localhost:4321` con URLs de
producción en la misma suite, así que la mitad de las medidas "mejoraban" al
desplegar y no al cambiar código, y los LCP de 15-22 s que salían en local eran
el portátil, no la web.

El histórico de aquellos 7 builds está migrado a `lh.ndjson` (sólo las
URLs de producción, que son las comparables). Las filas anteriores a
2026-08-21 llevan `js`/`css`/`img`/`bytes` a `null`: el servidor no guardaba
pesos de recursos.

### Ojo con las filas `desktop` viejas

La config antigua de desktop sólo cambiaba `screenEmulation` y `formFactor`, así
que **heredaba el throttling de móvil**: medía un viewport de escritorio sobre
4G lento con la CPU a 1/4. No es ningún escenario real, y por eso "desktop"
salía sistemáticamente peor que "mobile".

Está arreglado en `lighthouserc.prod.desktop.cjs` (valores del preset `desktop`
de Lighthouse, explícitos), pero eso rompe la comparabilidad: las filas `desktop`
**anteriores a 2026-08-21 no son comparables con las posteriores**. Como
referencia del salto, la home pasó de perf 74 / LCP 9658 ms a perf 93 /
LCP 1698 ms sin tocar una línea del sitio. Las filas `mobile` no están
afectadas.

Si algún día quieres las gráficas de vuelta, el NDJSON se reinyecta en un
servidor LHCI cuando haga falta. Nada se ha perdido.
