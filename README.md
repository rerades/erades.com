# Registro de rendimiento

Rama de sólo datos. **No contiene código y no se mergea a `master`.**

`lh.ndjson` guarda una línea por `(url, form factor)` y ejecución de Lighthouse
contra producción. Lo escribe `.github/workflows/lighthouse.yml` (semanal, lunes
05:00 UTC, y a mano con *Run workflow*).

Vive aparte de `master` porque Render despliega con `autoDeploy` por commit y sin
caché: un commit semanal a `master` dispararía un rebuild completo de producción
por un fichero que no toca el sitio.

```bash
# la última medición
git log -1 -p origin/metrics -- lh.ndjson

# evolución del peso de JS en la home mobile
git show origin/metrics:lh.ndjson \
  | grep '"url":"/es","ff":"mobile"' \
  | jq -r '[.ts,.commit,.js,.perf] | @tsv'
```

El formato de las filas, cómo leerlas y los cortes de comparabilidad están
documentados en `docs/lighthouse.md`, en `master`.
