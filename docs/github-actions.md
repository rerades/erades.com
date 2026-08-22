# CI/CD

Tres workflows en `.github/workflows/`. No hay workflow de despliegue: **Render
despliega solo**, con `autoDeploy` por commit sobre `master` y sin caché de
build.

## 1. CI (`ci.yml`)

En cada `push` y cada pull request contra `master`. Concurrencia por rama, con
`cancel-in-progress`: un push nuevo cancela la ejecución anterior.

Seis jobs independientes, todos sobre `ubuntu-latest` con pnpm cacheado:

| Job | Qué corre |
|---|---|
| `Lint-Check` | `pnpm lint` (ESLint, `--max-warnings=0`) |
| `Type-Check` | `pnpm typecheck` (`tsc --noEmit`) |
| `Unit-Tests` | `pnpm test:unit` (Vitest) |
| `E2E-Tests` | `pnpm test:e2e`. Playwright arranca el servidor él mismo (`webServer` en `playwright.config.ts`) |
| `Visual-Regression-Tests` | `pnpm test:visual`, **dentro** del contenedor oficial de Playwright (bloque `container:`) |
| `Build-App` | `pnpm build` |

Localmente, el equivalente rápido antes de empujar:
`pnpm lint && pnpm typecheck && pnpm test:unit`.

### El job visual es distinto al resto

Corre dentro de la imagen oficial de Playwright, no en el runner pelado. Eso es
lo que hace reproducibles las baselines: el rasterizado del texto depende de la
versión del navegador y de las fuentes del sistema. **Mantén el tag de la
imagen y la versión de `@playwright/test` en `package.json` sincronizados** —
un desajuste es una causa conocida de fallos (ver [docker.md](./docker.md)).
Dependabot excluye `@playwright/test` de sus PRs agrupados justo para que ese
bump llegue solo y se vea.

El job **se salta a sí mismo** en PRs que sólo tocan `docs/` o un `.md` de
raíz, porque esos no pueden mover un píxel. El filtro vive en el paso
«Decidir si la suite visual aplica», y no en un `paths-ignore` a nivel de
workflow, porque un check requerido *saltado* se queda «pending» para siempre y
bloquea el merge.

Ojo: **no** trata todo `*.md` como documentación. Los posts viven en
`src/content/blog/**/*.md` y cambiar uno mueve el listado y el paginador.

### Regenerar baselines visuales

Actions → CI → *Run workflow* con `update_visual_snapshots = true`, descargar el
artefacto `playwright-updated-snapshots` y copiarlo sobre
`tests/visual-regression/visual-regression.spec.ts-snapshots/`. El porqué de
no hacerlo en local, y qué mirar en el diff antes de commitear, en
[docker.md](./docker.md).

### Artefactos

- `playwright-report` — informe HTML del E2E.
- `playwright-visual-report` — informe HTML de la suite visual.
- `playwright-updated-snapshots` — sólo con `update_visual_snapshots`.
- Los `test-results` de la suite visual (con los `-diff.png`) sólo en fallo.

## 2. Security (`security.yml`)

`pnpm audit --audit-level moderate`. Las excepciones y los pines viven en
`pnpm-workspace.yaml`:

- `overrides:` — transitivas con aviso que sus padres aún no han bumpeado
  (sobre todo `@lhci/cli` y `lighthouse`). Revisar al actualizar esos paquetes.
- `auditConfig.ignoreGhsas:` — lo que no tiene arreglo publicado, con el motivo
  escrito al lado. Hoy sólo `GHSA-jmr9-qjv8-65gv` (`extract-zip`, que llega por
  `@lhci/cli` y cuya ruta vulnerable no se ejecuta nunca aquí).

## 3. Lighthouse (`lighthouse.yml`)

Semanal (lunes 05:00 UTC) y a mano. Mide **producción** y añade una fila a
`lh.ndjson` en la rama huérfana `metrics`. Deliberadamente no se dispara con
`push`. Todo el porqué está en [lighthouse.md](./lighthouse.md).

## Dependabot

`.github/dependabot.yml`: npm y GitHub Actions, semanal, agrupados. Con
`@playwright/test` fuera del grupo, por lo dicho arriba.

## Cuando algo falla

**Toda la suite visual falla con timeout de 30 s esperando un selector.** No es
una regresión de render: no hay nada escuchando en `BASE_URL`. La config visual
no tiene `webServer`, así que espera un servidor ya arrancado. En local:
`pnpm build && PORT=4321 pnpm start`, y comprueba con
`curl -sI http://localhost:4321/es`. Y usa el servidor de producción, no
`pnpm dev`: desde Astro 7, `astro dev` sólo escucha en IPv6 `[::1]`.

**Un snapshot visual falla y el diff es texto borroso.** Es tu máquina. Los
diffs locales en Apple Silicon son enormes y esperados; sirven para ver *qué*
cambió, nunca para bendecir una baseline.

**El check visual se queda pendiente para siempre.** Mira si el paso «Decidir
si la suite visual aplica» lo saltó; el job debe terminar en verde igualmente,
nunca ser saltado a nivel de workflow.

**`pnpm install --frozen-lockfile` falla tras tocar dependencias.** Comprueba
que `pnpm-workspace.yaml` no tiene un placeholder en `allowBuilds` — es lo que
deja `bejamas add`, y es una de las razones por las que no lo usamos (ver
[bejamas-ui.md](./bejamas-ui.md)).
